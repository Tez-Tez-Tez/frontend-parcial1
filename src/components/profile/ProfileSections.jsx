import { getTypeInfo } from '../../utils/pokemonUtils';

export function ProfileHeader({ profile, setSidebarOpen, setEditForm, setShowEditModal }) {
  return (
    <div className="pf-top">
      <div className="pf-navbar">
        <button
          className="pf-hamburger"
          onClick={() => setSidebarOpen(true)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className="pf-header-wrap">
        <div className="pf-header-card">
          <div className="pf-header-inner">
            <div className="pf-avatar-box">
              <img className="pf-avatar-img" src={profile.avatar} alt={profile.name} />
            </div>
            <div className="pf-header-info">
              <div className="pf-name-row">
                <h1 className="pf-name">{profile.name}</h1>
                <span className="pf-badge-entrenador">ENTRENADOR</span>
              </div>
              <p className="pf-subtitle">{profile.subtitle}</p>
            </div>
            <div className="pf-header-actions">
              <button className="pf-btn-editar" onClick={() => {
                setEditForm({...profile})
                setShowEditModal(true)
              }}>
                Editar Perfil
              </button>
              <button className="pf-btn-share">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SidebarInterno({ setShowSearch }) {
  return (
    <div className="pf-sidebar-card">
      <div className="pf-side-row" onClick={() => setShowSearch(true)}>
        <div className="pf-side-icon" style={{ background: '#DCFCE7' }}>
          <svg width="20" height="16" viewBox="0 0 20 16" fill="#16A34A">
            <rect x="0" y="0" width="8" height="7" rx="1"/>
            <rect x="12" y="0" width="8" height="7" rx="1"/>
            <rect x="0" y="9" width="8" height="7" rx="1"/>
            <rect x="12" y="9" width="8" height="7" rx="1"/>
          </svg>
        </div>
        <div>
          <p className="pf-side-label">Añadir Favorito</p>
          <p className="pf-side-sub">Buscar y agregar Pokémon</p>
        </div>
      </div>

      <div className="pf-side-row pf-side-border">
        <div className="pf-side-icon" style={{ background: '#DBEAFE' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
            <circle cx="12" cy="8" r="6"/>
            <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>
          </svg>
        </div>
        <div>
          <p className="pf-side-label">Logros destacados</p>
          <p className="pf-side-sub">Muestra tus mejores medallas</p>
        </div>
      </div>

      <div className="pf-side-row pf-side-border">
        <div className="pf-side-icon" style={{ background: '#F3E8FF' }}>
          <svg width="22" height="16" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
        </div>
        <div>
          <p className="pf-side-label">Añadir Amigos</p>
          <p className="pf-side-sub">Conoce a mas entrenadores</p>
        </div>
      </div>
    </div>
  );
}

export function FavoritesSection({ favoritePokemon, loading, removeFromFavorites, setShowSearch, profile }) {
  return (
    <div className="pf-fav-section">
      <div className="pf-fav-header">
        <span className="pf-fav-title">
          <svg width="20" height="19" viewBox="0 0 24 22" fill="#EF5552">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          Mis Favoritos
        </span>
        <button className="pf-ver-todo">Ver Todo ({favoritePokemon.length})</button>
      </div>

      {loading ? (
        <div className="pf-loading">Cargando favoritos...</div>
      ) : (
        <div className="pf-grid">
          {favoritePokemon.map(pokemon => (
            <div key={pokemon.id} className="pf-mon-card" style={{ position: 'relative' }}>
              <button 
                className="pf-remove-btn"
                onClick={(e) => removeFromFavorites(pokemon.name, e)}
              >
                ×
              </button>
              <div className="pf-mon-img-wrap">
                <img src={pokemon.image} alt={pokemon.name} />
              </div>
              <div className="pf-mon-body">
                <div className="pf-mon-meta-row">
                  <div>
                    <p className="pf-add-fav-label">#{pokemon.id.toString().padStart(3, '0')}</p>
                    <p className="pf-mon-name">{pokemon.name}</p>
                  </div>
                  {pokemon.types.length === 1 ? (
                    (() => {
                      const info = getTypeInfo(pokemon.types[0])
                      return (
                        <span className={`pf-tipo ${info.class}`}>
                          {info.text}
                        </span>
                      )
                    })()
                  ) : (
                    <div className="pf-tipos-row">
                      {pokemon.types.map(type => {
                        const info = getTypeInfo(type)
                        return (
                          <span key={type} className={`pf-tipo ${info.class}`}>
                            {info.text}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
                <div className="pf-mon-bottom">
                  <span className="pf-mon-owner">{profile.subtitle}</span>
                  <svg width="17" height="16" viewBox="0 0 24 22" fill="#EF5552">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}

          <div 
            className="pf-mon-card pf-mon-add-card"
            onClick={() => setShowSearch(true)}
          >
            <div className="pf-add-circle">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                stroke="#EF5552" strokeWidth="2" strokeLinecap="round">
                <line x1="7" y1="1" x2="7" y2="13"/>
                <line x1="1" y1="7" x2="13" y2="7"/>
              </svg>
            </div>
            <p className="pf-add-text">Añadir Favorito</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function TrainerJourney({ profile }) {
  return (
    <div className="pf-viaje-section">
      <div className="pf-viaje-title-row">
        <svg width="22" height="20" viewBox="0 0 24 22" fill="#EF5552">
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
        </svg>
        <h2 className="pf-viaje-title">Viaje del Entrenador</h2>
      </div>
      <div className="pf-viaje-card">
        <p className="pf-viaje-text">{profile.bio}</p>
        <div className="pf-tag-row">
          {profile.regions.map((region, i) => (
            <span className="pf-region-tag" key={i}>{region}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
