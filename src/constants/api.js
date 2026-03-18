/**
 * Constantes de configuración de API
 */

export const API_CONFIG = {
  BASE_URL: 'https://pokeapi.co/api/v2',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const API_ENDPOINTS = {
  POKEMON: (name) => `/pokemon/${name}`,
  POKEMON_SPECIES: (id) => `/pokemon-species/${id}`,
  EVOLUTION_CHAIN: (id) => `/evolution-chain/${id}`,
  GENERATION: (id) => `/generation/${id}`,
  TYPE: (name) => `/type/${name}`,
  ABILITY: (name) => `/ability/${name}`,
  ENCOUNTERS: (id) => `/pokemon/${id}/encounters`,
};
