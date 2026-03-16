/**
 * Componente: PokemonCard
 * Tarjeta para mostrar información de un Pokémon
 */

import { formatters } from '../utils/formatters.js';
import '../styles/PokemonCard.css';

export function PokemonCard({ pokemon }) {
  if (!pokemon) {
    return <div className="pokemon-card empty">No Pokémon selected</div>;
  }

  return (
    <div className="pokemon-card">
      <div className="pokemon-header">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="pokemon-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300?text=No+Image';
          }}
        />
        <div className="pokemon-title">
          <h2>{formatters.formatName(pokemon.name)}</h2>
          <p className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</p>
        </div>
      </div>

      <div className="pokemon-info">
        <div className="info-item">
          <span className="label">Height:</span>
          <span className="value">{formatters.formatNumber(pokemon.height)} m</span>
        </div>
        <div className="info-item">
          <span className="label">Weight:</span>
          <span className="value">{formatters.formatNumber(pokemon.weight)} kg</span>
        </div>
      </div>

      {pokemon.types.length > 0 && (
        <div className="pokemon-types">
          <h3>Types</h3>
          <div className="types-list">
            {pokemon.types.map((tipo) => (
              <span
                key={tipo.original}
                className="type-badge"
                style={{ backgroundColor: formatters.getTypeColor(tipo.original) }}
              >
                {formatters.formatName(tipo.translated)}
              </span>
            ))}
          </div>
        </div>
      )}

      {pokemon.abilities.length > 0 && (
        <div className="pokemon-abilities">
          <h3>Abilities</h3>
          <ul>
            {pokemon.abilities.map((ability) => (
              <li key={ability.name}>
                {formatters.formatName(ability.name)}
                {ability.isHidden && <span className="hidden-badge">Hidden</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {pokemon.stats.length > 0 && (
        <div className="pokemon-stats">
          <h3>Stats</h3>
          <div className="stats-list">
            {pokemon.stats.map((stat) => (
              <div key={stat.name} className="stat-item">
                <span className="stat-name">{formatters.formatName(stat.name)}</span>
                <div className="stat-bar">
                  <div
                    className="stat-fill"
                    style={{
                      width: `${Math.min((stat.value / 150) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
