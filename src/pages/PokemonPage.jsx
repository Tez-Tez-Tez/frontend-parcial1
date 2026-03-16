import { useState } from 'react';
import { usePokemon } from '../hooks/usePokemon.js';
import { PokemonSearch } from '../components/PokemonSearch.jsx';
import { PokemonCard } from '../components/PokemonCard.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/ErrorMessage.jsx';
import '../styles/PokemonPage.css';

export function PokemonPage() {
  const [searchQuery, setSearchQuery] = useState('ditto');
  const { pokemon, loading, error } = usePokemon(searchQuery);
  const [showError, setShowError] = useState(!!error);

  const handleSearch = (query) => {
    setShowError(false);
    setSearchQuery(query);
  };

  return (
    <div className="pokemon-page">
      <header className="page-header">
        <h1>Pokémon Finder</h1>
        <p>Discover detailed information about any Pokémon</p>
      </header>

      <main className="page-content">
        <PokemonSearch onSearch={handleSearch} loading={loading} />

        {loading && <LoadingSpinner />}

        {error && showError && (
          <ErrorMessage
            message={error}
            onDismiss={() => setShowError(false)}
          />
        )}

        {!loading && !error && <PokemonCard pokemon={pokemon} />}
      </main>
    </div>
  );
}
