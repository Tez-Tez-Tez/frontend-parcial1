import React, { useState } from 'react';
import '../styles/DetallePokemon.css';
import { formatters, traducciones } from '../utils/formatters.js';


const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export function DetallePokemon({ pokemon }) {
  const [activeTab, setActiveTab] = useState('descripcion');

  if (!pokemon) {
    return <div className="pokemon-empty">No hay Pokémon seleccionado</div>;
  }

  const getStatWidth = (val) => `${(val / 255) * 100}%`;

  // Añade esta función para las fracciones (½, ¼, ⅛)
  const formatMultiplier = (val) => {
    if (val === 0.5) return '½';
    if (val === 0.25) return '¼';
    if (val === 0.125) return '⅛';
    return val;
  };

  return (
    <div className="detalle-pokemon">
      {/* HEADER: Imagen y Datos Básicos */}
      <header className="dp-header">
        <div className="dp-image-container">
          <img 
            src={pokemon.image} 
            alt={pokemon.name} 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Sin+Imagen'; }}
          />
          <span className="dp-id">#{String(pokemon.id).padStart(4, '0')}</span>
        </div>
        
        <div className="dp-title-info">
          <h1>{pokemon.name.toUpperCase()}</h1>
          <p className="dp-subtitle">{pokemon.category || 'Pokémon desconocido'}</p>
          
          <div className="dp-types">
            {pokemon.types.map(tipo => (
              <span 
                key={tipo.original} 
                className="type-badge"
                style={{ backgroundColor: formatters.getTypeColor(tipo.original) }}
              >
                {tipo.translated.toUpperCase()}
              </span>
            ))}
          </div>

          <div className="dp-measurements">
            <div className="measurement-box">
              <span className="label">ALTURA</span>
              <span className="value">{pokemon.height} m</span>
            </div>
            <div className="measurement-box">
              <span className="label">PESO</span>
              <span className="value">{pokemon.weight} kg</span>
            </div>
          </div>
        </div>
      </header>

      {/* TABS */}
      <nav className="dp-tabs">
        <button 
          className={activeTab === 'descripcion' ? 'active' : ''} 
          onClick={() => setActiveTab('descripcion')}
        >
          Descripción
        </button>
        <button 
          className={activeTab === 'movimientos' ? 'active' : ''} 
          onClick={() => setActiveTab('movimientos')}
        >
          Movimientos
        </button>
        <button 
          className={activeTab === 'localizacion' ? 'active' : ''} 
          onClick={() => setActiveTab('localizacion')}
        >
          Localización
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL (Grid 2 columnas) */}
      <div className="dp-content-grid">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="dp-col-left">
          
          {/* Estadísticas Base */}
          {activeTab === 'descripcion' && (
            <section className="dp-card">
              <h2><i className="icon-stats"></i> Estadísticas Base</h2>
              <div className="stats-list">
                {pokemon.stats.map((stat) => (
                  <div className="stat-row" key={stat.name}>
                    <span className="stat-name">{stat.name.toUpperCase()}</span>
                    <span className="stat-val">{stat.value}</span>
                    <div className="stat-bar-bg">
                      <div className="stat-bar-fill" style={{ width: getStatWidth(stat.value) }}></div>
                    </div>
                  </div>
                ))}
                <div className="stat-total">
                  <span>Total</span>
                  <span className="total-val">{pokemon.stats.reduce((acc, curr) => acc + curr.value, 0)}</span>
                </div>
              </div>
            </section>
          )}

          {/* Habilidades */}
          {activeTab === 'descripcion' && (
            <section className="dp-card">
              <h2><i className="icon-bolt"></i> Habilidades</h2>
              <div className="abilities-grid">
                {pokemon.abilities.map((ability, index) => (
                  <div className={`ability-box ${ability.isHidden ? 'hidden-ability' : ''}`} key={index}>
                    <div className="ability-header">
                      <h3>{capitalize(ability.name)}</h3>
                      {ability.isHidden && <span className="oculto-badge">OCULTO</span>}
                    </div>
                    <p>{ability.description || 'Descripción no disponible'}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cadena de Evolución */}
          {activeTab === 'descripcion' && (
            <section className="dp-card">
              <h2><i className="icon-evo"></i> Cadena de Evolución</h2>
              <div className="evolution-chain">
                {pokemon.evolutions && pokemon.evolutions.length > 0 ? (
                  pokemon.evolutions.map((evo, index) => (
                    <React.Fragment key={evo.name}>
                      <div className={`evo-item ${evo.name.toLowerCase() === pokemon.name.toLowerCase() ? 'current-evo' : ''}`}>
                        <div className="evo-img-box">
                          <img src={evo.image || 'https://via.placeholder.com/100?text=No+Image'} alt={evo.name} />
                        </div>
                        <span>{capitalize(evo.name)}</span>
                      </div>
                      {index < pokemon.evolutions.length - 1 && (
                        <div className="evo-arrow">
                          <span>→</span>
                          <small>Lvl {pokemon.evolutions[index + 1].level}</small>
                        </div>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <p>No hay información de evolución disponible</p>
                )}
              </div>
            </section>
          )}

          {/* Movimientos por Nivel */}
          {activeTab === 'movimientos' && (
            <section className="dp-card">
              <div className="moves-header">
                <h2><i className="icon-swords"></i> Movimiento por nivel</h2>
                <span className="gen-badge">Gen IX</span>
              </div>
              <div className="moves-list">
                {pokemon.moves && pokemon.moves.length > 0 ? (
                  pokemon.moves.map((move, index) => (
                    <div className="move-row" key={index}>
                      <span className="move-lvl">{move.level}</span>
                      <div className="move-info">
                        <h4>{capitalize(move.name)}</h4>
                        <span className={`move-type text-${move.type.toLowerCase()}`}>{move.type.toUpperCase()}</span>
                      </div>
                      <div className="move-stats">
                        <div className="m-stat">
                          <span className="val">{move.power || '--'}</span>
                          <span className="lbl">Potencia</span>
                        </div>
                        <div className="m-stat">
                          <span className="val">{move.accuracy || '--'}</span>
                          <span className="lbl">Precisión</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No hay movimientos disponibles</p>
                )}
              </div>
            </section>
          )}

          {/* Localización */}
          {activeTab === 'localizacion' && (
            <section className="dp-card">
              <h2><i className="icon-location"></i> Localización</h2>
              
              {pokemon.encounters && pokemon.encounters.length > 0 ? (
                <ul className="encounters-list" style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                  {pokemon.encounters.map((encounter, index) => (
                    <li key={index} className="encounter-item">
                      {/* Usamos tu formatter para limpiar los guiones y capitalizar */}
                      {formatters.formatName(encounter.name)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Este Pokémon no se encuentra en estado salvaje o su ubicación es desconocida en esta versión.</p>
              )}
            </section>
          )}

        </div>

        {/* COLUMNA DERECHA */}
        <div className="dp-col-right">
          
          {/* Debilidades y Resistencias */}
          {activeTab === 'descripcion' && (
            <section className="dp-card">
              <h2><i className="icon-shield-down"></i> Debilidades</h2>
                  <div className="type-multiplier-grid">
                {pokemon.weaknesses && pokemon.weaknesses.length > 0 ? (
                  pokemon.weaknesses.map(weak => (
                    <div className="multiplier-badge" key={weak.type}>
                      {/* Aplicamos color dinámico al icono */}
                      <span 
                        className={`type-icon type-${weak.type.toLowerCase()}`}
                        style={{ backgroundColor: formatters.getTypeColor(weak.type) }}
                      ></span>
                      <span className="type-name">
                        {/* Traducimos y ponemos en MAYÚSCULAS según el Figma */}
                        {(traducciones.tipos[weak.type] || weak.type).toUpperCase()}
                      </span>
                      <span className="multiplier red">{weak.multiplier}x</span>
                    </div>
                  ))
                ) : (
                  <p>No hay debilidades conocidas</p>
                )}
              </div>

              <h2 className="mt-4"><i className="icon-shield-up"></i> Resistencias</h2>
              <div className="type-multiplier-grid mini">
                {pokemon.resistances && pokemon.resistances.length > 0 ? (
                  pokemon.resistances.map(res => (
                    <div className="multiplier-badge mini" key={res.type}>
                      <span className="type-name">
                        {/* Traducimos y capitalizamos la primera letra */}
                        {capitalize(traducciones.tipos[res.type] || res.type)}
                      </span>
                      {/* Usamos el formateador de fracciones */}
                      <span className="multiplier green">{formatMultiplier(res.multiplier)}x</span>
                    </div>
                  ))
                ) : (
                  <p>No hay resistencias conocidas</p>
                )}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}