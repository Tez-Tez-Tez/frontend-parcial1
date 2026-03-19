import { getTypeInfo } from '../../utils/pokemonUtils';

export function SearchModal({ 
  showSearch, setShowSearch, searchTerm, setSearchTerm, 
  searchPokemon, searching, searchResults, addToFavorites 
}) {
  if (!showSearch) return null;

  return (
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
          
          {!searching && searchResults.map(pokemon => (
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
          ))}
        </div>
      </div>
    </div>
  );
}

const AVATAR_OPTIONS = [
  { src: '/Ash.png', label: 'Ash' },
  { src: '/Misty.png', label: 'Misty' },
  { src: '/Brock.png', label: 'Brock' },
  { src: '/Gary.png', label: 'Gary' },
  { src: '/Dawn.png', label: 'Dawn' },
]

export function EditModal({ 
  showEditModal, setShowEditModal, editForm, setEditForm, 
  handleAvatarChange, handleSaveProfile 
}) {
  if (!showEditModal) return null;

  return (
    <div className="pf-modal-overlay" onClick={() => setShowEditModal(false)}>
      <div className="pf-modal-content pf-edit-modal" onClick={e => e.stopPropagation()}>
        <div className="pf-modal-header">
          <h3>Editar Perfil</h3>
          <button className="pf-modal-close" onClick={() => setShowEditModal(false)}>×</button>
        </div>
        
        <div className="pf-edit-form">
          <div className="pf-edit-avatar-section">
            <div className="pf-edit-avatar-preview">
              <img src={editForm.avatar} alt="Avatar" />
            </div>

            <div className="pf-avatar-options">
              <h4>Seleccionar Avatar</h4>
              <div className="pf-avatar-grid">
                {AVATAR_OPTIONS.map((avatar) => (
                  <button
                    key={avatar.src}
                    type="button"
                    className={`pf-avatar-option ${editForm.avatar === avatar.src ? 'active' : ''}`}
                    onClick={() => setEditForm({ ...editForm, avatar: avatar.src })}
                    title={avatar.label}
                  >
                    <img src={avatar.src} alt={avatar.label} />
                    <span>{avatar.label}</span>
                  </button>
                ))}
              </div>

              <div className="pf-custom-file-upload">
                <label className="pf-edit-avatar-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Cargar imagen personalizada
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pf-edit-field">
            <label>Nombre</label>
            <input 
              type="text" 
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              placeholder="Ingresa tu nombre"
            />
          </div>

          <div className="pf-edit-field">
            <label>Título / Subtítulo</label>
            <input 
              type="text" 
              value={editForm.subtitle}
              onChange={(e) => setEditForm({...editForm, subtitle: e.target.value})}
              placeholder="Ej: Maestro Pokémon • Región"
            />
          </div>

          <div className="pf-edit-field">
            <label>Biografía</label>
            <textarea 
              rows="4"
              value={editForm.bio}
              onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
              placeholder="Cuéntale a otros sobre ti..."
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
              placeholder="Kanto, Johto, Hoenn..."
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
  );
}
