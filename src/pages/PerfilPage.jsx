import { useState, useEffect } from 'react'
import '../styles/Perfil.css'
import Sidebar from '../components/SidebarPerfil.jsx'

// Imagen por defecto (puedes cambiarla después)
const DEFAULT_AVATAR = '../public/Ash.png'

// IDs iniciales (Pikachu, Charizard, Lapras)
const INITIAL_FAVORITES = [25, 6, 131]

// Tipos traducidos al español
const typeTranslations = {
  fire: 'FUEGO',
  water: 'AGUA',
  grass: 'PLANTA',
  electric: 'ELÉCTRICO',
  ice: 'HIELO',
  flying: 'VOLADOR',
  psychic: 'PSÍQUICO',
  poison: 'VENENO',
  ground: 'TIERRA',
  rock: 'ROCA',
  bug: 'BICHO',
  ghost: 'FANTASMA',
  dark: 'SINIESTRO',
  dragon: 'DRAGÓN',
  steel: 'ACERO',
  fairy: 'HADA',
  normal: 'NORMAL',
  fighting: 'LUCHA'
}

export default function PerfilPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [favoritePokemon, setFavoritePokemon] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  
  // Estado del perfil
  const [profile, setProfile] = useState({
    name: 'Ash Ketchum',
    subtitle: 'Maestro Pokémon • Pueblo Paleta, Kanto',
    avatar: DEFAULT_AVATAR,
    bio: 'Soy Ash Ketchum, de Pueblo Paleta. Estoy viajando con mi compañero Pikachu para convertirme en el mejor Maestro Pokémon del mundo. Hemos viajado por Kanto, Johto, Hoenn y muchas otras regiones haciendo amigos y enfrentando desafíos difíciles. ¡No importa lo difícil que sea, nunca nos rendimos!',
    regions: ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Teselia', 'Kalos', 'Alola', 'Galar']
  })

  // Estado para el modal de edición
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ ...profile })

  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    loadFavorites()
    loadProfile()
  }, [])

  const loadFavorites = async () => {
    setLoading(true)
    try {
      const savedFavorites = localStorage.getItem('pokemonFavorites')
      
      if (savedFavorites) {
        setFavoritePokemon(JSON.parse(savedFavorites))
      } else {
        const promises = INITIAL_FAVORITES.map(id => 
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
        )
        const results = await Promise.all(promises)
        
        const pokemonData = results.map(pokemon => ({
          id: pokemon.id,
          name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
          image: pokemon.sprites.other['official-artwork'].front_default,
          types: pokemon.types.map(t => t.type.name)
        }))
        
        setFavoritePokemon(pokemonData)
        localStorage.setItem('pokemonFavorites', JSON.stringify(pokemonData))
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = () => {
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }

  // Guardar perfil en localStorage
  const saveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile))
  }

  // Guardar favoritos en localStorage
  useEffect(() => {
    if (favoritePokemon.length > 0) {
      localStorage.setItem('pokemonFavorites', JSON.stringify(favoritePokemon))
    }
  }, [favoritePokemon])

  // Guardar perfil cuando cambie
  useEffect(() => {
    saveProfile()
  }, [profile])

  // Buscar Pokémon
  const searchPokemon = async (term) => {
    if (!term.trim()) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
      const data = await response.json()
      
      const filtered = data.results
        .filter(p => p.name.includes(term.toLowerCase()))
        .slice(0, 8)
      
      const details = await Promise.all(
        filtered.map(async (p) => {
          const res = await fetch(p.url)
          return await res.json()
        })
      )
      
      setSearchResults(details.map(d => ({
        id: d.id,
        name: d.name.charAt(0).toUpperCase() + d.name.slice(1),
        image: d.sprites.other['official-artwork'].front_default,
        types: d.types.map(t => t.type.name)
      })))
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setSearching(false)
    }
  }

  // Agregar Pokémon a favoritos
  const addToFavorites = async (pokemon) => {
    if (favoritePokemon.some(p => p.id === pokemon.id)) {
      alert('¡Este Pokémon ya está en favoritos!')
      return
    }
    
    setFavoritePokemon([...favoritePokemon, pokemon])
    setShowSearch(false)
    setSearchTerm('')
    setSearchResults([])
  }

  // Eliminar Pokémon de favoritos
  const removeFromFavorites = (id, e) => {
    e.stopPropagation()
    setFavoritePokemon(favoritePokemon.filter(p => p.id !== id))
  }

  // Limpiar todos los favoritos
  const clearAllFavorites = () => {
    if (window.confirm('¿Eliminar todos los favoritos?')) {
      setFavoritePokemon([])
      localStorage.removeItem('pokemonFavorites')
    }
  }

  // Manejar cambio de avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditForm({ ...editForm, avatar: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  // Guardar cambios del perfil
  const handleSaveProfile = () => {
    setProfile(editForm)
    setShowEditModal(false)
  }

  // Obtener clase CSS y texto en español para el tipo
  const getTypeInfo = (type) => {
    const typeMap = {
      fire: { class: 'fuego', text: 'FUEGO' },
      water: { class: 'agua', text: 'AGUA' },
      grass: { class: 'planta', text: 'PLANTA' },
      electric: { class: 'electrico', text: 'ELÉCTRICO' },
      ice: { class: 'hielo', text: 'HIELO' },
      flying: { class: 'volador', text: 'VOLADOR' },
      psychic: { class: 'psiquico', text: 'PSÍQUICO' },
      poison: { class: 'veneno', text: 'VENENO' },
      ground: { class: 'tierra', text: 'TIERRA' },
      rock: { class: 'roca', text: 'ROCA' },
      bug: { class: 'bicho', text: 'BICHO' },
      ghost: { class: 'fantasma', text: 'FANTASMA' },
      dark: { class: 'siniestro', text: 'SINIESTRO' },
      dragon: { class: 'dragon', text: 'DRAGÓN' },
      steel: { class: 'acero', text: 'ACERO' },
      fairy: { class: 'hada', text: 'HADA' },
      normal: { class: 'normal', text: 'NORMAL' },
      fighting: { class: 'lucha', text: 'LUCHA' }
    }
    return typeMap[type] || { class: type, text: type.toUpperCase() }
  }

  return (
    <div className="pf-root">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Modal de búsqueda de Pokémon */}
      {showSearch && (
        <div className="pf-modal-overlay" onClick={() => setShowSearch(false)}>
          <div className="pf-modal-content" onClick={e => e.stopPropagation()}>
            <div className="pf-modal-header">
              <h3>Añadir Pokémon a Favoritos</h3>
              <button className="pf-modal-close" onClick={() => setShowSearch(false)}>×</button>
            </div>
            
            <div className="pf-modal-search">
              <input
                type="text"
                placeholder="Buscar Pokémon por nombre..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  searchPokemon(e.target.value)
                }}
                autoFocus
              />
            </div>

            <div className="pf-modal-results">
              {searching && <div className="pf-search-loading">Buscando...</div>}
              
              {!searching && searchResults.map(pokemon => {
                const typeInfo = getTypeInfo(pokemon.types[0])
                return (
                  <div 
                    key={pokemon.id} 
                    className="pf-search-result"
                    onClick={() => addToFavorites(pokemon)}
                  >
                    <img src={pokemon.image} alt={pokemon.name} />
                    <div>
                      <strong>{pokemon.name}</strong>
                      <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                        {pokemon.types.map(type => {
                          const info = getTypeInfo(type)
                          return (
                            <span key={type} className={`pf-tipo ${info.class}`}>
                              {info.text}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición de perfil */}
      {showEditModal && (
        <div className="pf-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="pf-modal-content pf-edit-modal" onClick={e => e.stopPropagation()}>
            <div className="pf-modal-header">
              <h3>Editar Perfil</h3>
              <button className="pf-modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            
            <div className="pf-edit-form">
              <div className="pf-edit-avatar">
                <img src={editForm.avatar} alt="Avatar" />
                <label className="pf-edit-avatar-btn">
                  Cambiar foto
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div className="pf-edit-field">
                <label>Nombre</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                />
              </div>

              <div className="pf-edit-field">
                <label>Título / Subtítulo</label>
                <input 
                  type="text" 
                  value={editForm.subtitle}
                  onChange={(e) => setEditForm({...editForm, subtitle: e.target.value})}
                />
              </div>

              <div className="pf-edit-field">
                <label>Biografía</label>
                <textarea 
                  rows="4"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                />
              </div>

              <div className="pf-edit-field">
                <label>Regiones (separadas por coma)</label>
                <input 
                  type="text" 
                  value={editForm.regions.join(', ')}
                  onChange={(e) => setEditForm({
                    ...editForm, 
                    regions: e.target.value.split(',').map(r => r.trim()).filter(r => r)
                  })}
                />
              </div>

              <div className="pf-edit-actions">
                <button className="pf-btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </button>
                <button className="pf-btn-save" onClick={handleSaveProfile}>
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ZONA SUPERIOR */}
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

      {/* ZONA INFERIOR */}
      <div className="pf-bottom">
        <div className="pf-bottom-inner">

          {/* SIDEBAR INTERNO */}
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

          {/* COLUMNA DERECHA */}
          <div className="pf-right-col">

            {/* MIS FAVORITOS */}
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
                        onClick={(e) => removeFromFavorites(pokemon.id, e)}
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

                  {/* Tarjeta Añadir */}
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

            {/* VIAJE DEL ENTRENADOR - AHORA DINÁMICO */}
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

          </div>
        </div>
      </div>
    </div>
  )
}