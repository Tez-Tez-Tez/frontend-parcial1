import { useState } from 'react';
import { useNav } from '../context/NavContext.jsx';
import { usePokemon } from '../hooks/usePokemon.js';
import { DetallePokemon } from '../components/DetallePokemon.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/ErrorMessage.jsx';
import { SiteFooter } from '../components/SiteFooter.jsx';
import '../styles/PokemonPage.css';
import '../styles/PokemonModal.css';

export default function DetallePokemonPage() {
  const { selectedPokemon, closePokemonDetail } = useNav();
  const { pokemon, loading, error } = usePokemon(selectedPokemon);
  const [showError, setShowError] = useState(true);

  if (!selectedPokemon) {
    return (
      <div className="pokemon-page-wrapper">
        <main className="main-content">
          <div className="detail-empty">
            <p>No hay Pokémon seleccionado.</p>
            <button className="perfil-back-btn" type="button" onClick={closePokemonDetail}>
              ← Volver a Pokédex
            </button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="pokemon-page-wrapper">
      <main className="main-content">
        <div className="detail-header">
          <button className="perfil-back-btn" type="button" onClick={closePokemonDetail}>
            ← Volver
          </button>
        </div>

        {loading && (
          <div className="pokemon-modal-loading">
            <LoadingSpinner />
            <p>Cargando datos...</p>
          </div>
        )}

        {error && showError && (
          <div className="pokemon-modal-error">
            <ErrorMessage message={error} onDismiss={() => setShowError(false)} />
          </div>
        )}

        {!loading && !error && pokemon && (
          <DetallePokemon pokemon={pokemon} />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
