/**
 * Componente: PokemonSearch
 * Buscador de Pokémon con filtros, autocompletado y ordenamiento
 */

import { useState, useEffect } from 'react';
import { useNav } from '../context/NavContext.jsx';
import '../styles/PokemonSearch.css';

// Tipos de Pokémon disponibles
const POKEMON_TYPES = [
  { id: 'fire', label: 'Fuego', color: '#FF7F24' },
  { id: 'water', label: 'Agua', color: '#40A8FF' },
  { id: 'grass', label: 'Planta', color: '#7FBF00' },
  { id: 'electric', label: 'Eléctrico', color: '#FFD700' },
  { id: 'ice', label: 'Hielo', color: '#98D8D8' },
  { id: 'flying', label: 'Volador', color: '#B8A8E8' },
  { id: 'psychic', label: 'Psíquico', color: '#F85888' },
  { id: 'poison', label: 'Veneno', color: '#A040A0' },
  { id: 'ground', label: 'Tierra', color: '#D2B48C' },
  { id: 'rock', label: 'Roca', color: '#A9A9A9' },
  { id: 'bug', label: 'Bicho', color: '#A8B820' },
  { id: 'ghost', label: 'Fantasma', color: '#705898' },
  { id: 'dark', label: 'Siniestro', color: '#705848' },
  { id: 'dragon', label: 'Dragón', color: '#7038F8' },
  { id: 'steel', label: 'Acero', color: '#B8B8D0' },
  { id: 'fairy', label: 'Hada', color: '#EE99AC' },
  { id: 'normal', label: 'Normal', color: '#A8A878' },
  { id: 'fighting', label: 'Lucha', color: '#C03028' },
];

const SORT_OPTIONS = [
  { id: 'id-asc', label: 'Número Pokédex (Ascendente)' },
  { id: 'id-desc', label: 'Número Pokédex (Descendente)' },
  { id: 'name-asc', label: 'Nombre (A-Z)' },
  { id: 'name-desc', label: 'Nombre (Z-A)' },
  { id: 'type-asc', label: 'Tipo (A-Z)' },
];

export function PokemonSearch({ loading = false }) {
  const { updateSearchQuery, updateSortBy, selectType } = useNav();
  const [input, setInput] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSort, setSelectedSort] = useState('id-asc');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // List of popular Pokémon for suggestions
  const popularPokemon = [
    'pikachu', 'charizard', 'blastoise', 'venusaur', 'dragonite',
    'gyarados', 'lapras', 'arcanine', 'alakazam', 'machamp',
    'golem', 'arcanine', 'mew', 'mewtwo', 'articuno',
    'zapdos', 'moltres', 'raichu', 'marowak', 'sandslash'
  ];

  // Generar sugerencias automáticas
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim().length > 0) {
      const query = value.toLowerCase();
      const filtered = popularPokemon.filter(p =>
        p.includes(query)
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      updateSearchQuery(input);
      updateSortBy(selectedSort);
      if (selectedType) {
        selectType(selectedType);
      }
      setInput('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name) => {
    setInput('');
    setSuggestions([]);
    setShowSuggestions(false);
    updateSearchQuery(name);
    updateSortBy(selectedSort);
    if (selectedType) {
      selectType(selectedType);
    }
  };

  const handleQuickSearch = (name) => {
    updateSearchQuery(name);
    updateSortBy(selectedSort);
    if (selectedType) {
      selectType(selectedType);
    }
    setInput('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    if (value) {
      selectType(value);
    }
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSelectedSort(value);
    updateSortBy(value);
  };

  return (
    <div className="pokemon-search">
      <form onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onFocus={() => input.trim().length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Busca por nombre o ID (ej: pikachu, 25)..."
            disabled={loading}
            className="search-input"
            autoComplete="off"
          />
          <button type="submit" disabled={loading} className="search-button">
            {loading ? 'Buscando...' : 'Buscar'}
          </button>

          {/* Sugerencias automáticas */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  {suggestion.charAt(0).toUpperCase() + suggestion.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="search-filters">
          {/* Filtro por tipo */}
          <div className="filter-group">
            <label className="filter-label">Tipo:</label>
            <select
              value={selectedType}
              onChange={handleTypeChange}
              disabled={loading}
              className="filter-select"
            >
              <option value="">Todos los tipos</option>
              {POKEMON_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenamiento */}
          <div className="filter-group">
            <label className="filter-label">Ordenar por:</label>
            <select
              value={selectedSort}
              onChange={handleSortChange}
              disabled={loading}
              className="filter-select"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>

      {/* Búsqueda rápida */}
      <div className="quick-search">
        <p>Búsqueda rápida:</p>
        <div className="quick-buttons">
          {['pikachu', 'charizard', 'lapras', 'dragonite'].map((name) => (
            <button
              key={name}
              onClick={() => handleQuickSearch(name)}
              disabled={loading}
              className="quick-button"
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
