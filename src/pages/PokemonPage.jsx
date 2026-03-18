import { useState, useEffect } from 'react';
import { usePokemon } from '../hooks/usePokemon.js';
import { usePokedex } from '../hooks/usePokedex.js';
import { useNav } from '../context/NavContext.jsx';
import { PokemonCard } from '../components/PokemonCard.jsx';
import { DetallePokemon } from '../components/DetallePokemon.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/ErrorMessage.jsx';
import Sidebar from '../components/Sidebar.jsx';
import '../styles/PokemonPage.css';
import '../styles/PokemonModal.css';

export function PokemonPage() {
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Determinar generaciones a usar
  const generationsToUse = selectedGeneration 
    ? [selectedGeneration] 
    : [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const { pokemons, loading: listLoading, error: listError, refetch } = usePokedex({
    generationIds: generationsToUse,
    perGeneration: 10, // Aumenta para ver más pokémon
  });

  // Filtrar por tipo si está seleccionado
  const filteredPokemons = selectedType
    ? pokemons.filter((p) => p.types?.some((t) => (t.translated || t.original || '').toLowerCase() === selectedType.toLowerCase()))
    : pokemons;

  // Calcular paginación
  const totalPages = Math.ceil(filteredPokemons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPokemons = filteredPokemons.slice(startIndex, endIndex);

  const [selected, setSelected] = useState(null);
  const { pokemon, loading: detailLoading, error: detailError } = usePokemon(selected);
  const [showError, setShowError] = useState(true);
  const { sidebarOpen, closeSidebar } = useNav();

  // Handlers para generaciones y tipos
  const handleGenerationSelect = (genNumber) => {
    setSelectedGeneration(genNumber);
    setCurrentPage(1); // Reset paginación
    closeSidebar();
  };

  const handleTypeSelect = (typeName) => {
    setSelectedType(selectedType === typeName ? null : typeName);
    setCurrentPage(1); // Reset paginación
    closeSidebar();
  };

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

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
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar}
        onGenerationSelect={handleGenerationSelect}
        onTypeSelect={handleTypeSelect}
        selectedGeneration={selectedGeneration}
        selectedType={selectedType}
      />
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
              {paginatedPokemons.map((p) => (
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

            {/* Paginación */}
            <div className="pagination" id="pagination">
              <button 
                type="button" 
                className="pagination-btn pagination-prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              
              {/* Números de página */}
              {currentPage > 2 && (
                <>
                  <button 
                    type="button"
                    className="pagination-btn"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </button>
                  {currentPage > 3 && <span className="pagination-ellipsis">...</span>}
                </>
              )}

              {currentPage > 1 && (
                <button 
                  type="button"
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  {currentPage - 1}
                </button>
              )}

              <button 
                type="button"
                className="pagination-btn pagination-active"
              >
                {currentPage}
              </button>

              {currentPage < totalPages && (
                <button 
                  type="button"
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  {currentPage + 1}
                </button>
              )}

              {currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && <span className="pagination-ellipsis">...</span>}
                  <button 
                    type="button"
                    className="pagination-btn"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button 
                type="button"
                className="pagination-btn pagination-next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                ›
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
