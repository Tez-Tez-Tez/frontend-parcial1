import '../styles/Sidebar.css'

export default function Sidebar({ isOpen, onClose }) {
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
              <span className="sb-logo-text">PokeSPA</span>
            </div>

            {/* Nav */}
            <nav className="sb-nav">

              {/* Perfil — activo */}
              <a className="sb-link sb-link-active" href="/perfil" onClick={onClose}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#EF5552" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Perfil</span>
              </a>

              {/* Home */}
              <a className="sb-link" href="/" onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
                  <path d="M9 21V12h6v9"/>
                </svg>
                <span>Home</span>
              </a>

              {/* Configuración */}
              <a className="sb-link" href="/configuracion" onClick={onClose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                <span>Configuración</span>
              </a>

            </nav>
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