import { useState } from 'react';
import { usePokemon } from '../hooks/usePokemon.js';
import { PokemonSearch } from '../components/PokemonSearch.jsx';
import { PokemonCard } from '../components/PokemonCard.jsx';
import { DetallePokemon } from '../components/DetallePokemon.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/ErrorMessage.jsx';
import '../styles/PokemonPage.css';

export function PokemonPage() {
  const [searchQuery, setSearchQuery] = useState('ditto');
  const { pokemon, loading, error } = usePokemon(searchQuery);
  const [showError, setShowError] = useState(!!error);
  const [showDetail, setShowDetail] = useState(false);

  const handleSearch = (query) => {
    setShowError(false);
    setSearchQuery(query);
    setShowDetail(false); // Close detail view when searching for new pokemon
  };

  const handleCardClick = () => {
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
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

        {!loading && !error && !showDetail && (
          <div onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <PokemonCard pokemon={pokemon} />
          </div>
        )}

        {!loading && !error && showDetail && (
          <div>
            <button 
              onClick={handleCloseDetail}
              className="back-button"
              style={{
                marginBottom: '20px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              ← Volver
            </button>
            <DetallePokemon pokemon={pokemon} />
          </div>
        )}
      </main>
    </div>
  );
}
