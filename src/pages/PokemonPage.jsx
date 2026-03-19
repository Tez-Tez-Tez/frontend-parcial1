import { useState, useEffect, useMemo } from 'react';
import { usePokedex } from '../hooks/usePokedex.js';
import { PokemonCard } from '../components/PokemonCard.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/ErrorMessage.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useNav } from '../context/NavContext.jsx';
import { SiteFooter } from '../components/SiteFooter.jsx';
import '../styles/PokemonPage.css';

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
    toggleSidebar,
    isSidebarOpen,
    closeSidebar,
    openPokemonDetail,

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

  const [showError, setShowError] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [activeGeneration, activeNavigation, activeType, searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleCardClick = (name) => {
    setShowError(false);
    openPokemonDetail(name);
  };

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
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <main className="main-content">
        <div className="main-header" style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%', paddingLeft: '60px' }}>
          <button 
            className="hamburger" 
            onClick={toggleSidebar} 
            aria-label="Menú"
            style={{ position: 'absolute', left: '0px' }}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1 style={{ margin: 0 }}>Pokedex</h1>
          <button className="filter-btn" style={{ marginLeft: 'auto' }}>
            <div className="filter-icon-container">
              <div className="filter-icon"></div>
            </div>
            <div className="filter-text">Filtrar por: ID</div>
          </button>
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
    </div>
  );
}
