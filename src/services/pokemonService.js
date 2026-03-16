/**
 * Servicio especializado para la PokeAPI
 * Centraliza toda la lógica relacionada con Pokémon
 */

import apiClient from './apiClient.js';
import { API_ENDPOINTS, API_CONFIG } from '../constants/api.js';
import { traducciones } from '../utils/formatters.js'; // Ajusta la ruta según tu proyecto

class PokemonService {
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
