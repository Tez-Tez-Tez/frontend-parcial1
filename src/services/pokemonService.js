/**
 * Servicio especializado para la PokeAPI
 * Centraliza toda la lógica relacionada con Pokémon
 */

import apiClient from './apiClient.js';
import { API_ENDPOINTS } from '../constants/api.js';

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
      return this._normalizeData(data);
    } catch (error) {
      throw new Error(`Failed to fetch Pokemon: ${error.message}`);
    }
  }

  /**
   * Normaliza los datos del Pokémon para su uso en la UI
   * @private
   */
  _normalizeData(data) {
    return {
      id: data.id,
      name: data.name,
      height: data.height / 10, // convertir a metros
      weight: data.weight / 10, // convertir a kg
      image: data.sprites?.other?.['official-artwork']?.front_default || data.sprites?.front_default,
      types: data.types?.map((t) => t.type.name) || [],
      abilities: data.abilities?.map((a) => ({
        name: a.ability.name,
        isHidden: a.is_hidden,
      })) || [],
      stats: data.stats?.map((s) => ({
        name: s.stat.name,
        value: s.base_stat,
      })) || [],
    };
  }
}

export default new PokemonService();
