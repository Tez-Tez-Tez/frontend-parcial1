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
  );
}
