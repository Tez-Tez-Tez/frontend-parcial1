/**
 * Componente: PokemonCard
 * Tarjeta para mostrar información de un Pokémon
 */

import { formatters } from '../utils/formatters.js';
import '../styles/PokemonCard.css';

export function PokemonCard({ pokemon, isFavorite = false, onToggleFavorite }) {
  if (!pokemon) {
    return <div className="pokemon-card empty">No Pokémon selected</div>;
  }

  const imageSrc =
    pokemon.image ||
    'https://via.placeholder.com/300?text=No+Image';

  const hp = pokemon.stats?.find((s) => s.name === 'HP')?.value;
  const atk = pokemon.stats?.find((s) => s.name === 'ATK')?.value;
  const def = pokemon.stats?.find((s) => s.name === 'DEF')?.value;

  return (
    <article className="pokemon-card" aria-label={pokemon.name}>
      {/* Botón de favorito y ID */}
      <span className="pokemon-id">#{String(pokemon.id).padStart(4, '0')}</span>
      <button
        className={`favorite-btn ${isFavorite ? 'liked' : ''}`}
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite?.(pokemon.name);
        }}
      >
        {isFavorite ? '♥' : '♡'}
      </button>

      {/* Imagen */}
      <div className="pokemon-image-container">
        <img
          src={imageSrc}
          alt={pokemon.name}
          className="pokemon-image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300?text=No+Image';
          }}
        />
      </div>

      {/* Nombre y Tipos */}
      <h3 className="pokemon-name">{formatters.formatName(pokemon.name)}</h3>

      {pokemon.types?.length > 0 && (
        <div className="pokemon-types" aria-label="Tipos">
          {pokemon.types.map((tipo) => (
            <span
              key={tipo.original}
              className={`type-badge type-${tipo.original.toLowerCase()}`}
            >
              {tipo.translated.toUpperCase()}
            </span>
          ))}
        </div>
      )}

      {/* Estadísticas */}
      <div className="pokemon-stats" aria-label="Stats">
        <div className="stat">
          <span className="stat-label">HP</span>
          <span className="stat-value">{hp ?? '-'}</span>
        </div>
        <div className="stat">
          <span className="stat-label">ATK</span>
          <span className="stat-value">{atk ?? '-'}</span>
        </div>
        <div className="stat">
          <span className="stat-label">DEF</span>
          <span className="stat-value">{def ?? '-'}</span>
        </div>
      </div>
    </article>
  );
}
