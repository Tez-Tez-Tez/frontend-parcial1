/**
 * Componente: PokemonSearch
 * Buscador de Pokémon
 */

import { useState } from 'react';
import '../styles/PokemonSearch.css';

export function PokemonSearch({ onSearch, loading }) {
  const [input, setInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
      setInput('');
    }
  };

  const handleQuickSearch = (name) => {
    onSearch(name);
    setInput('');
  };

  return (
    <div className="pokemon-search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search by name or ID (e.g., ditto, 132)..."
          disabled={loading}
          className="search-input"
        />
        <button type="submit" disabled={loading} className="search-button">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="quick-search">
        <p>Quick search:</p>
        <div className="quick-buttons">
          {['ditto', 'pikachu', 'charizard', 'blastoise'].map((name) => (
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
