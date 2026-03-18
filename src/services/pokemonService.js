/**
 * Servicio especializado para la PokeAPI
 * Centraliza toda la lógica relacionada con Pokémon
 */

import apiClient from './apiClient.js';
import { API_ENDPOINTS, API_CONFIG } from '../constants/api.js';
import { traducciones } from '../utils/formatters.js'; // Ajusta la ruta según tu proyecto

class PokemonService {
  constructor() {
    this._basicCache = new Map();
    this._generationCache = new Map();
  }

  /**
   * Obtiene información detallada de un Pokémon
   * @param {string} nameOrId - Nombre o ID del Pokémon
   * @returns {Promise<object>} Datos del Pokémon
   */
  async getPokemon(nameOrId) {
    if (!nameOrId) {
      throw new Error('Name or ID is required');
    }

    try {
      const endpoint = API_ENDPOINTS.POKEMON(nameOrId.toLowerCase());
      const data = await apiClient.get(endpoint);
      
      // Fetch additional data
      const speciesData = await apiClient.get(API_ENDPOINTS.POKEMON_SPECIES(data.id));
      const evolutionData = await this._getEvolutionChain(speciesData.evolution_chain.url);
      
      // NUEVO: Obtenemos las habilidades en paralelo
      const abilitiesData = await this._getAbilitiesData(data.abilities);
      
      // NUEVO: Obtenemos los encuentros
      const encountersData = await this._getEncounters(data.id);
      
      // Pasamos abilitiesData y encountersData al normalizador
      return this._normalizeData(data, speciesData, evolutionData, abilitiesData, encountersData);
    } catch (error) {
      throw new Error(`Failed to fetch Pokemon: ${error.message}`);
    }
  }

  /**
   * Obtiene información básica de un Pokémon (rápido) para listados.
   * Usa únicamente el endpoint `/pokemon/{nameOrId}`.
   * @param {string|number} nameOrId
   */
  async getPokemonBasic(nameOrId) {
    if (!nameOrId && nameOrId !== 0) {
      throw new Error('Name or ID is required');
    }

    const key = String(nameOrId).toLowerCase();
    const cached = this._basicCache.get(key);
    if (cached) return cached;

    try {
      const endpoint = API_ENDPOINTS.POKEMON(key);
      const data = await apiClient.get(endpoint);
      const normalized = this._normalizeBasicData(data);
      this._basicCache.set(key, normalized);
      return normalized;
    } catch (error) {
      throw new Error(`Failed to fetch Pokemon: ${error.message}`);
    }
  }

  /**
   * Obtiene una lista de Pokémon desde la PokeAPI, trayendo especies por generación.
   * Nota: se limita la cantidad por generación para evitar demasiadas peticiones.
   */
  async getPokemonsFromGenerations(options = {}) {
    const {
      generationIds = [1, 2, 3, 4, 5, 6, 7, 8, 9],
      typeId = null,
      perGeneration = 3,
      concurrency = 6,
    } = options;

    const gens = Array.isArray(generationIds) ? generationIds : [generationIds];
    const perGen = Math.max(1, Number(perGeneration) || 1);
    const limit = Math.max(1, Number(concurrency) || 1);
    const allowedTypeNames = typeId ? await this._getPokemonNamesByType(typeId) : null;

    const all = [];
    for (const genId of gens) {
      const species = await this._getGenerationSpecies(genId);
      const selected = allowedTypeNames
        ? species.filter((pokemon) => allowedTypeNames.has(pokemon.name)).slice(0, perGen)
        : species.slice(0, perGen);
      const pokemons = await this._mapWithConcurrency(selected, limit, (s) => this.getPokemonBasic(s.name));
      all.push(...pokemons);
    }

    // Orden por id para que el listado sea estable
    return all
      .filter(Boolean)
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  }

  async getPokemonsPageFromGenerations(options = {}) {
    const {
      generationIds = [1, 2, 3, 4, 5, 6, 7, 8, 9],
      typeId = null,
      searchQuery = '',
      page = 1,
      pageSize = 20,
      concurrency = 8,
    } = options;

    const gens = Array.isArray(generationIds) ? generationIds : [generationIds];
    const limit = Math.max(1, Number(concurrency) || 1);
    const safePage = Math.max(1, Number(page) || 1);
    const safePageSize = Math.max(1, Number(pageSize) || 20);
    const allowedTypeNames = typeId ? await this._getPokemonNamesByType(typeId) : null;

    const speciesByGeneration = await Promise.all(gens.map((genId) => this._getGenerationSpecies(genId)));
    const allSpecies = speciesByGeneration
      .flat()
      .filter((pokemon) => (allowedTypeNames ? allowedTypeNames.has(pokemon.name) : true))
      .filter((pokemon) => this._matchesSearch(pokemon, searchQuery))
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));

    const total = allSpecies.length;
    const totalPages = total > 0 ? Math.ceil(total / safePageSize) : 1;
    const normalizedPage = Math.min(safePage, totalPages);
    const startIndex = (normalizedPage - 1) * safePageSize;
    const pageSpecies = allSpecies.slice(startIndex, startIndex + safePageSize);
    const items = await this._mapWithConcurrency(pageSpecies, limit, async (species) => {
      const basicPokemon = await this.getPokemonBasic(species.name);
      return {
        ...basicPokemon,
        generationId: species.generationId ?? basicPokemon.generationId,
      };
    });

    return {
      items: items.filter(Boolean),
      total,
      page: normalizedPage,
      pageSize: safePageSize,
      totalPages,
    };
  }

  async getPokemonsByNames(options = {}) {
    const {
      names = [],
      typeId = null,
      generationIds = null,
      searchQuery = '',
      page = 1,
      pageSize = 20,
      concurrency = 6,
    } = options;

    const uniqueNames = [...new Set((Array.isArray(names) ? names : []).filter(Boolean).map((name) => String(name).toLowerCase()))];
    const safePage = Math.max(1, Number(page) || 1);
    const safePageSize = Math.max(1, Number(pageSize) || 20);
    const allowedGenerations = generationIds?.length ? new Set(generationIds) : null;
    const allItems = await this._mapWithConcurrency(uniqueNames, concurrency, async (name) => this.getPokemonBasic(name));

    const filteredItems = allItems
      .filter(Boolean)
      .filter((pokemon) => {
        const matchesType = typeId
          ? pokemon.types?.some((type) => type.original === typeId)
          : true;
        const matchesGeneration = allowedGenerations
          ? allowedGenerations.has(pokemon.generationId)
          : true;
        const matchesSearch = this._matchesSearch(pokemon, searchQuery);

        return matchesType && matchesGeneration && matchesSearch;
      });

    const total = filteredItems.length;
    const totalPages = total > 0 ? Math.ceil(total / safePageSize) : 1;
    const normalizedPage = Math.min(safePage, totalPages);
    const startIndex = (normalizedPage - 1) * safePageSize;

    return {
      items: filteredItems.slice(startIndex, startIndex + safePageSize),
      total,
      page: normalizedPage,
      pageSize: safePageSize,
      totalPages,
    };
  }

  async _getPokemonNamesByType(typeId) {
    try {
      const data = await apiClient.get(API_ENDPOINTS.TYPE(typeId));
      return new Set(
        (data.pokemon || [])
          .map((entry) => entry.pokemon?.name)
          .filter(Boolean)
      );
    } catch (error) {
      console.warn(`Failed to fetch type ${typeId}:`, error);
      return new Set();
    }
  }

  /**
   * Obtiene la cadena de evolución
   * @private
   */
  async _getEvolutionChain(url) {
    try {
      const data = await apiClient.get(url.replace(API_CONFIG.BASE_URL, ''));
      return this._parseEvolutionChain(data);
    } catch (error) {
      console.warn('Failed to fetch evolution chain:', error);
      return [];
    }
  }

  async _getGenerationSpecies(genId) {
    const key = String(genId);
    const cached = this._generationCache.get(key);
    if (cached) return cached;

    try {
      const data = await apiClient.get(API_ENDPOINTS.GENERATION(genId));
      const species = (data.pokemon_species || [])
        .map((s) => ({
          name: s.name,
          id: this._extractIdFromSpeciesUrl(s.url),
          generationId: Number(genId),
        }))
        .filter((s) => s.name);

      // La API no siempre viene ordenada; ordenamos por ID
      species.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));

      this._generationCache.set(key, species);
      return species;
    } catch (error) {
      console.warn(`Failed to fetch generation ${genId}:`, error);
      return [];
    }
  }

  _extractIdFromSpeciesUrl(url) {
    if (!url) return null;
    const match = String(url).match(/\/pokemon-species\/(\d+)\/?$/);
    return match ? Number(match[1]) : null;
  }

  _matchesSearch(pokemon, searchQuery) {
    const normalizedQuery = String(searchQuery || '').trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    const pokemonName = String(pokemon?.name || '').toLowerCase();
    const pokemonId = pokemon?.id != null ? String(pokemon.id) : '';

    return pokemonName.includes(normalizedQuery) || pokemonId.includes(normalizedQuery);
  }

  async _mapWithConcurrency(items, concurrency, mapper) {
    const list = Array.isArray(items) ? items : [];
    const limit = Math.max(1, Number(concurrency) || 1);
    const results = new Array(list.length);

    let index = 0;
    const worker = async () => {
      while (index < list.length) {
        const current = index++;
        try {
          results[current] = await mapper(list[current], current);
        } catch (e) {
          results[current] = null;
        }
      }
    };

    const workers = Array.from({ length: Math.min(limit, list.length) }, () => worker());
    await Promise.all(workers);
    return results;
  }

  _normalizeBasicData(data) {
    return {
      id: data.id,
      name: data.name,
      generationId: this._getGenerationIdFromPokemonId(data.id),
      image:
        data.sprites?.other?.['official-artwork']?.front_default ||
        data.sprites?.other?.dream_world?.front_default ||
        data.sprites?.front_default ||
        null,
      types:
        data.types?.map((t) => ({
          original: t.type.name,
          translated: traducciones.tipos[t.type.name] || t.type.name,
        })) ||
        [],
      stats:
        data.stats?.map((s) => ({
          name: traducciones.stats[s.stat.name] || s.stat.name,
          value: s.base_stat,
        })) ||
        [],
    };
  }

  _getGenerationIdFromPokemonId(id) {
    const pokemonId = Number(id);

    if (pokemonId >= 1 && pokemonId <= 151) return 1;
    if (pokemonId <= 251) return 2;
    if (pokemonId <= 386) return 3;
    if (pokemonId <= 493) return 4;
    if (pokemonId <= 649) return 5;
    if (pokemonId <= 721) return 6;
    if (pokemonId <= 809) return 7;
    if (pokemonId <= 905) return 8;
    if (pokemonId <= 1025) return 9;
    return null;
  }

  /**
   * Parsea la cadena de evolución en un formato más simple
   * @private
   */
  async _parseEvolutionChain(chain) {
    const evolutions = [];
    
    const parseChain = async (node, level = 1) => {
      try {
        // Fetch basic pokemon data for image
        const pokemonData = await apiClient.get(API_ENDPOINTS.POKEMON(node.species.name));
        evolutions.push({
          name: node.species.name,
          level: level,
          image: pokemonData.sprites?.other?.['official-artwork']?.front_default || pokemonData.sprites?.front_default,
        });
      } catch {
        // Fallback without image
        evolutions.push({
          name: node.species.name,
          level: level,
          image: null,
        });
      }
      
      if (node.evolves_to && node.evolves_to.length > 0) {
        for (const evolution of node.evolves_to) {
          const nextLevel = evolution.evolution_details[0]?.min_level || level + 1;
          await parseChain(evolution, nextLevel);
        }
      }
    };
    
    await parseChain(chain.chain);
    return evolutions;
  }

  /**
   * Obtiene y traduce los datos de las habilidades
   * @private
   */
  async _getAbilitiesData(abilities) {
    if (!abilities || abilities.length === 0) return [];

    const abilityPromises = abilities.map(async (a) => {
      try {
        // Hacemos la petición a la API para cada habilidad
        const abilityDetail = await apiClient.get(API_ENDPOINTS.ABILITY(a.ability.name));

        // Buscamos el nombre en español
        const esNameEntry = abilityDetail.names.find(n => n.language.name === 'es');
        const name = esNameEntry ? esNameEntry.name : a.ability.name;

        // Buscamos la descripción en español (flavor text)
        const esFlavorTextEntry = abilityDetail.flavor_text_entries.find(
          entry => entry.language.name === 'es'
        );
        
        // Limpiamos los saltos de línea extraños que manda la PokeAPI
        const description = esFlavorTextEntry
          ? esFlavorTextEntry.flavor_text.replace(/\n|\f|\r/g, ' ')
          : 'Descripción no disponible en español.';

        return {
          name: name,
          isHidden: a.is_hidden,
          description: description
        };
      } catch (error) {
        console.warn(`Failed to fetch ability ${a.ability.name}:`, error);
        return {
          name: a.ability.name,
          isHidden: a.is_hidden,
          description: 'Error al cargar la descripción.'
        };
      }
    });

    // Promise.all ejecuta todas las peticiones al mismo tiempo
    return Promise.all(abilityPromises);
  }

  /**
   * Obtiene las áreas de localización del Pokémon
   * @private
   */
  async _getEncounters(id) {
    try {
      const endpoint = API_ENDPOINTS.ENCOUNTERS(id);
      const data = await apiClient.get(endpoint);
      
      // Mapeamos para extraer solo el nombre del área
      return data.map(encounter => ({
        name: encounter.location_area.name
      }));
    } catch (error) {
      console.warn(`Failed to fetch encounters for pokemon ${id}:`, error);
      return [];
    }
  }

  _normalizeData(data, speciesData, evolutionData, abilitiesData, encountersData) {
    const typeEffectiveness = this._calculateTypeEffectiveness(data.types?.map(t => t.type.name) || []);
    
    // Categoría: Buscamos si de casualidad la PokeAPI ya trae el 'es' en pokemon-species
    const categoryEs = speciesData?.genera?.find(g => g.language.name === 'es')?.genus || 'Desconocido';
    
    return {
      id: data.id,
      name: data.name,
      height: data.height / 10,
      weight: data.weight / 10,
      image: data.sprites?.other?.['official-artwork']?.front_default || data.sprites?.front_default,
      
      // TRADUCCIÓN DE TIPOS AL ESPAÑOL USANDO EL DICCIONARIO
      types: data.types?.map((t) => ({
        original: t.type.name, // "fire" -> Lo usamos para las clases CSS
        translated: traducciones.tipos[t.type.name] || t.type.name // "Fuego" -> Lo usamos para la vista
      })) || [],
      
      // REEMPLAZA EL MAPEO DE HABILIDADES CON EL NUEVO ARREGLO
      abilities: abilitiesData || [],
      
      // FORMATEO DE STATS (HP, ATK, DEF, etc. como en tu Figma)
      stats: data.stats?.map((s) => ({
        name: traducciones.stats[s.stat.name] || s.stat.name,
        value: s.base_stat,
      })) || [],
      
      category: categoryEs,
      evolutions: evolutionData || [],
      weaknesses: typeEffectiveness.weaknesses,
      resistances: typeEffectiveness.resistances,
      moves: this._getMovesByLevel(data.moves || []),
      encounters: encountersData || [],
    };
  }

  /**
   * Calcula efectividad de tipos (simplificado)
   * @private
   */
  _calculateTypeEffectiveness(types) {
    // Simplified type effectiveness - in a real app you'd have a proper type chart
    const weaknesses = [];
    const resistances = [];
    
    // Basic type relationships (simplified)
    const typeRelations = {
      fire: { weakTo: ['water', 'ground', 'rock'], resists: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'] },
      water: { weakTo: ['electric', 'grass'], resists: ['fire', 'water', 'ice', 'steel'] },
      grass: { weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'], resists: ['water', 'electric', 'grass', 'ground'] },
      electric: { weakTo: ['ground'], resists: ['electric', 'flying', 'steel'] },
      // Add more types as needed...
    };
    
    types.forEach(type => {
      const relations = typeRelations[type] || { weakTo: [], resists: [] };
      relations.weakTo.forEach(weakType => {
        if (!weaknesses.find(w => w.type === weakType)) {
          weaknesses.push({ type: weakType, multiplier: 2 });
        }
      });
      relations.resists.forEach(resistType => {
        if (!resistances.find(r => r.type === resistType)) {
          resistances.push({ type: resistType, multiplier: 0.5 });
        }
      });
    });
    
    return { weaknesses, resistances };
  }

  /**
   * Obtiene movimientos ordenados por nivel
   * @private
   */
  _getMovesByLevel(moves) {
    return moves
      .filter(move => move.version_group_details.some(vgd => vgd.move_learn_method.name === 'level-up'))
      .map(move => {
        const levelDetail = move.version_group_details.find(vgd => vgd.move_learn_method.name === 'level-up');
        return {
          level: levelDetail?.level_learned_at || 1,
          name: move.move.name,
          type: 'normal', // Would need another API call to get move details
          power: null,
          accuracy: null,
        };
      })
      .sort((a, b) => a.level - b.level)
      .slice(0, 20); // Limit to first 20 moves
  }
}

export default new PokemonService();
