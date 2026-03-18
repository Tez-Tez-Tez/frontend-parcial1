/**
 * Funciones utilitarias para formatear datos
 */

export const formatters = {
  /**
   * Capitaliza la primera letra de un string
   */
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Reemplaza guiones con espacios y capitaliza
   */
  formatName: (name) => {
    return formatters.capitalize(name?.replace(/-/g, ' ') || '');
  },

  /**
   * Formatea números con decimales
   */
  formatNumber: (num, decimals = 1) => {
    return Number(num).toFixed(decimals);
  },

  /**
   * Genera color basado en tipo de Pokémon
   */
  getTypeColor: (type) => {
    const colors = {
      normal: '#A8A878',
      fighting: '#C03028',
      flying: '#A890F0',
      poison: '#A040A0',
      ground: '#E0C068',
      rock: '#B8A038',
      bug: '#A8B820',
      ghost: '#705898',
      steel: '#B8B8D0',
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      psychic: '#F85888',
      ice: '#98D8D8',
      dragon: '#7038F8',
      dark: '#705848',
      fairy: '#EE99AC',
    };
    return colors[type?.toLowerCase()] || '#777777';
  },
};

// En tu archivo utils/formatters.js (o crea uno llamado translations.js)

export const traducciones = {
  tipos: {
    normal: 'Normal',
    fire: 'Fuego',
    water: 'Agua',
    electric: 'Eléctrico',
    grass: 'Planta',
    ice: 'Hielo',
    fighting: 'Lucha',
    poison: 'Veneno',
    ground: 'Tierra',
    flying: 'Volador',
    psychic: 'Psíquico',
    bug: 'Bicho',
    rock: 'Roca',
    ghost: 'Fantasma',
    dragon: 'Dragón',
    dark: 'Siniestro',
    steel: 'Acero',
    fairy: 'Hada'
  },
  stats: {
    'hp': 'HP',
    'attack': 'ATK',
    'defense': 'DEF',
    'special-attack': 'SPA',
    'special-defense': 'SPD',
    'speed': 'SPE'
  }
};
