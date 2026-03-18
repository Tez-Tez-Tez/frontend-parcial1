import '../styles/Sidebar.css'

export default function Sidebar({ 
  isOpen, 
  onClose, 
  onGenerationSelect = () => {},
  onTypeSelect = () => {},
  selectedGeneration = null,
  selectedType = null
}) {
  const generations = Array.from({ length: 9 }, (_, i) => i + 1);
  const types = [
    { name: 'Normal', color: '#A8A878' },
    { name: 'Fuego', color: '#F08030' },
    { name: 'Agua', color: '#6890F0' },
    { name: 'Planta', color: '#78C850' },
    { name: 'Eléctrico', color: '#F8D030' },
    { name: 'Hielo', color: '#98D8D8' },
    { name: 'Lucha', color: '#C03028' },
    { name: 'Veneno', color: '#A040A0' },
    { name: 'Tierra', color: '#E0C068' },
    { name: 'Volador', color: '#A890F0' },
    { name: 'Psíquico', color: '#F85888' },
    { name: 'Bicho', color: '#A8B820' },
    { name: 'Roca', color: '#B8A038' },
    { name: 'Fantasma', color: '#705898' },
    { name: 'Dragón', color: '#7038F8' },
    { name: 'Siniestro', color: '#705848' },
    { name: 'Acero', color: '#B8B8D0' },
    { name: 'Hada', color: '#EE99AC' },
  ];

  const handleGenerationClick = (genNum) => {
    onGenerationSelect(genNum);
  };

  const handleTypeClick = (typeName) => {
    onTypeSelect(typeName);
  };

  return (
    <>
      {/* Overlay — clic fuera cierra */}
      {isOpen && <div className="sb-overlay" onClick={onClose} />}

      <aside className={`sb-root ${isOpen ? 'sb-open' : ''}`}>
        <div className="sb-inner">

          {/* TOP */}
          <div className="sb-top">

            {/* Logo — PokeSPA en negro según Figma */}
            <div className="sb-logo">
              <div className="sb-logo-icon">
                <svg width="20" height="16" viewBox="0 0 20 16" fill="white">
                  <rect x="0" y="0" width="8" height="7" rx="1"/>
                  <rect x="12" y="0" width="8" height="7" rx="1"/>
                  <rect x="0" y="9" width="8" height="7" rx="1"/>
                  <rect x="12" y="9" width="8" height="7" rx="1"/>
                </svg>
              </div>
              <span className="sb-logo-text">PokéSPA</span>
            </div>

            {/* NAVEGACIÓN */}
            <div className="sb-section">
              <h3 className="sb-section-title">NAVEGACIÓN</h3>
              <nav className="sb-section-links">
                <a className="sb-link sb-link-active" href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>
                  <span className="sb-link-error">⚠️</span>
                  <span>Pokédex</span>
                </a>
                <a className="sb-link sb-link-disabled" href="#" onClick={(e) => e.preventDefault()}>
                  <span className="sb-link-icon">✓</span>
                  <span>Recomendamos Rechazos</span>
                </a>
                <a className="sb-link" href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>
                  <span className="sb-link-icon">★</span>
                  <span>Favoritos</span>
                </a>
              </nav>
            </div>

            {/* GENERACIÓN */}
            <div className="sb-section">
              <h3 className="sb-section-title">GENERACIÓN</h3>
              <div className="sb-gen-grid">
                {generations.map((gen) => (
                  <button
                    key={gen}
                    className={`sb-gen-btn ${selectedGeneration === gen ? 'sb-gen-btn-active' : ''}`}
                    onClick={() => handleGenerationClick(gen)}
                  >
                    GEN {gen}
                  </button>
                ))}
              </div>
            </div>

            {/* TIPOS */}
            <div className="sb-section">
              <h3 className="sb-section-title">TIPOS</h3>
              <div className="sb-types-grid">
                {types.map((type, idx) => (
                  <button
                    key={idx}
                    className={`sb-type-btn ${selectedType === type.name ? 'sb-type-btn-active' : ''}`}
                    style={{ 
                      backgroundColor: type.color,
                      opacity: selectedType === type.name ? 1 : 0.8
                    }}
                    onClick={() => handleTypeClick(type.name)}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM: usuario */}
          <div className="sb-user">
            <div className="sb-user-avatar">
              <img
                src="../public/Ash.png"
                alt="Ash"
                onError={(e) => { e.currentTarget.style.opacity = '0' }}
              />
            </div>
            <div className="sb-user-info">
              <p className="sb-user-name">Ash Ketchum</p>
              <p className="sb-user-role">Entrenador de Élite</p>
            </div>
          </div>

        </div>
      </aside>
    </>
  )
}