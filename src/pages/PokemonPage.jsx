import { useState, useEffect, useMemo } from 'react';
import { usePokemon } from '../hooks/usePokemon.js';
import { usePokedex } from '../hooks/usePokedex.js';
import { PokemonCard } from '../components/PokemonCard.jsx';
import { DetallePokemon } from '../components/DetallePokemon.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/ErrorMessage.jsx';
import { SiteFooter } from '../components/SiteFooter.jsx';
import { useNav } from '../context/NavContext.jsx';
import '../styles/PokemonPage.css';
import '../styles/PokemonModal.css';

export function PokemonPage() {
  const generationIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const pageSize = 20;
  const {
    activeNavigation,
    activeGeneration,
    activeType,
    searchQuery,
    favoritePokemon,
    recentPokemon,
    toggleFavoritePokemon,
    addRecentPokemon,
  } = useNav();
  const [currentPage, setCurrentPage] = useState(1);
  const scopedNames = activeNavigation === 'favorites'
    ? favoritePokemon
    : activeNavigation === 'recent'
      ? recentPokemon
      : [];
  const { pokemons, loading: listLoading, error: listError, totalPages } = usePokedex({
    mode: activeNavigation,
    names: scopedNames,
    generationIds: activeGeneration ? [activeGeneration] : generationIds,
    typeId: activeType,
    searchQuery,
    page: currentPage,
    pageSize,
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

  useEffect(() => {
    setCurrentPage(1);
  }, [activeGeneration, activeNavigation, activeType, searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleCardClick = (name) => {
    setShowError(false);
    setSelected(name);
    addRecentPokemon(name);
  };

  const handleCloseModal = () => setSelected(null);

  const paginationItems = useMemo(() => {
    if (totalPages <= 1) {
      return [1];
    }

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 'ellipsis', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, 'ellipsis', currentPage, currentPage + 1, 'ellipsis-end', totalPages];
  }, [currentPage, totalPages]);

  const emptyStateMessage = useMemo(() => {
    if (activeNavigation === 'favorites') {
      return 'No tienes pokemones marcados como favoritos todavía.';
    }

    if (activeNavigation === 'recent') {
      return 'Todavia no has abierto ningun pokemon desde la pokedex.';
    }

    if (activeType) {
      return 'No hay pokemones cargados que coincidan con ese tipo.';
    }

    if (searchQuery) {
      return `No se encontraron pokemones para la busqueda "${searchQuery}".`;
    }

    if (activeGeneration) {
      return `No se encontraron pokemones para la generacion ${activeGeneration}.`;
    }

    return 'No hay pokemones para mostrar.';
  }, [activeGeneration, activeNavigation, activeType, searchQuery]);

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
                  <PokemonCard
                    pokemon={p}
                    isFavorite={favoritePokemon.includes(p.name)}
                    onToggleFavorite={toggleFavoritePokemon}
                  />
                </div>
              ))}
            </section>

            {pokemons.length === 0 && (
              <div className="pagination-empty-state" id="emptySidebarFiltersState">
                <p>{emptyStateMessage}</p>
              </div>
            )}

            {pokemons.length > 0 && totalPages > 0 && (
              <nav className="pagination-bar" id="pagination" aria-label="Paginacion de Pokemon">
                <button
                  type="button"
                  className="pagination-arrow"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  aria-label="Pagina anterior"
                >
                  ‹
                </button>

                {paginationItems.map((item, index) => {
                  if (String(item).includes('ellipsis')) {
                    return (
                      <span key={`${item}-${index}`} className="pagination-dots" aria-hidden="true">
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={item}
                      type="button"
                      className={`pagination-page ${currentPage === item ? 'pagination-page-active' : ''}`}
                      onClick={() => setCurrentPage(item)}
                      aria-current={currentPage === item ? 'page' : undefined}
                    >
                      {item}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className="pagination-arrow"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Pagina siguiente"
                >
                  ›
                </button>
              </nav>
            )}
          </>
        )}
      </main>

      <SiteFooter />

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
