import { useState, useEffect } from 'react';
import { usePokemon } from '../hooks/usePokemon.js';
import { usePokedex } from '../hooks/usePokedex.js';
import { PokemonCard } from '../components/PokemonCard.jsx';
import { DetallePokemon } from '../components/DetallePokemon.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/ErrorMessage.jsx';
import '../styles/PokemonPage.css';
import '../styles/PokemonModal.css';

export function PokemonPage() {
  const { pokemons, loading: listLoading, error: listError, refetch } = usePokedex({
    perGeneration: 3, // Se puede aumentar luego, ahora son 3 por generación para prueba rápida
  });

  const [selected, setSelected] = useState(null);
  const { pokemon, loading: detailLoading, error: detailError } = usePokemon(selected);
  const [showError, setShowError] = useState(true);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  const handleCardClick = (name) => {
    setShowError(false);
    setSelected(name);
  };

  const handleCloseModal = () => setSelected(null);

  return (
    <div className="pokemon-page-wrapper">
      <main className="main-content">
        <div className="main-header">
          <h1>Pokedex</h1>
          <div className="filter-btn">
            🔽 Filter por 📊
          </div>
        </div>

        {listLoading && <LoadingSpinner />}

        {(listError) && showError && (
          <ErrorMessage
            message={listError}
            onDismiss={() => setShowError(false)}
          />
        )}

        {!listLoading && !listError && (
          <>
            <section className="pokemon-grid" id="pokemonGrid" aria-label="Listado de Pokémon">
              {pokemons.map((p) => (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  className="pokedex-grid-item"
                  onClick={() => handleCardClick(p.name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleCardClick(p.name);
                  }}
                  style={{ cursor: 'pointer', outline: 'none' }}
                >
                  <PokemonCard pokemon={p} />
                </div>
              ))}
            </section>

            {/* Paginación estática de ejemplo o el botón recargar */}
            <div className="pagination" id="pagination">
              <button type="button" className="pokedex-reload" onClick={refetch} disabled={listLoading}>
                Recargar
              </button>
            </div>
          </>
        )}
      </main>

      {/* Footer original */}
      <footer>
        <div className="footer-left">
          <div className="footer-logo">🔴 PokéSPA</div>
          <p>
            Dentro el arte de la búsqueda. La mejor de datos más completa con actualizaciones, estrategias y secretos de legendarios.
          </p>
        </div>
        <div className="footer-right">
          <h4>POKEDEX</h4>
          <ul>
            <li><a href="#">Por generación</a></li>
            <li><a href="#">Por tipo</a></li>
            <li><a href="#">Legendarios</a></li>
          </ul>
        </div>
      </footer>

      {/* ── MODAL DE DETALLE ── */}
      {selected && (
        <div
          className="pokemon-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
          role="dialog"
          aria-modal="true"
          aria-label="Detalle del Pokémon"
        >
          <div className="pokemon-modal-container">
            <button
              className="pokemon-modal-close"
              onClick={handleCloseModal}
              aria-label="Cerrar"
              type="button"
            >
              ✕
            </button>

            {detailLoading && (
              <div className="pokemon-modal-loading">
                <LoadingSpinner />
                <p>Cargando datos...</p>
              </div>
            )}

            {detailError && showError && (
              <div className="pokemon-modal-error">
                <ErrorMessage message={detailError} onDismiss={handleCloseModal} />
              </div>
            )}

            {!detailLoading && !detailError && pokemon && (
              <DetallePokemon pokemon={pokemon} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
