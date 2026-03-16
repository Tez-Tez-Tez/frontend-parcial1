import { useState } from 'react'
import '../styles/Perfil.css'
import Sidebar from '../components/Sidebar.jsx'

const ASH_IMG = '../public/Ash.png'
const PIKACHU_IMG = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
const CHARIZARD_IMG = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png'
const LAPRAS_IMG = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png'

export default function PerfilPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="pf-root">

      {/* SIDEBAR — se abre/cierra con el botón ≡ */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── ZONA SUPERIOR: hero rosa ── */}
      <div className="pf-top">
        <div className="pf-navbar">
          {/* ← AQUÍ está el onClick que faltaba */}
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
                <img
                  className="pf-avatar-img"
                  src={ASH_IMG}
                  alt="Ash Ketchum"
                />
              </div>

              <div className="pf-header-info">
                <div className="pf-name-row">
                  <h1 className="pf-name">Ash Ketchum</h1>
                  <span className="pf-badge-entrenador">ENTRENADOR</span>
                </div>
                <p className="pf-subtitle">Maestro Pokémon • Pueblo Paleta, Kanto</p>
              </div>

              <div className="pf-header-actions">
                <button className="pf-btn-editar">Editar Perfil</button>
                <button className="pf-btn-share">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="#475569" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
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

      {/* ── ZONA INFERIOR ── */}
      <div className="pf-bottom">
        <div className="pf-bottom-inner">

          {/* SIDEBAR INTERNO */}
          <div className="pf-sidebar-card">
            <div className="pf-side-row">
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
                <p className="pf-side-sub">Añadir Favorito</p>
              </div>
            </div>

            <div className="pf-side-row pf-side-border">
              <div className="pf-side-icon" style={{ background: '#DBEAFE' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg width="22" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <button className="pf-ver-todo">Ver Todo</button>
              </div>

              <div className="pf-grid">

                {/* Pikachu */}
                <div className="pf-mon-card">
                  <div className="pf-mon-img-wrap">
                    <img src={PIKACHU_IMG} alt="Pikachu" />
                  </div>
                  <div className="pf-mon-body">
                    <div className="pf-mon-meta-row">
                      <div>
                        <p className="pf-add-fav-label">Añadir Favorito</p>
                        <p className="pf-mon-name">Pikachu</p>
                      </div>
                      <span className="pf-tipo electrico">ELECTRICO</span>
                    </div>
                    <div className="pf-mon-bottom">
                      <span className="pf-mon-owner">Maestro Pokémon • Pueblo Paleta, Kanto</span>
                      <svg width="17" height="16" viewBox="0 0 24 22" fill="#EF5552">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Charizard */}
                <div className="pf-mon-card">
                  <div className="pf-mon-img-wrap">
                    <img src={CHARIZARD_IMG} alt="Charizard" />
                  </div>
                  <div className="pf-mon-body">
                    <div className="pf-mon-meta-row">
                      <div>
                        <p className="pf-add-fav-label">Añadir Favorito</p>
                        <p className="pf-mon-name">Charizard</p>
                      </div>
                      <div className="pf-tipos-row">
                        <span className="pf-tipo fuego">FUEGO</span>
                        <span className="pf-tipo volador">VOLARDOR</span>
                      </div>
                    </div>
                    <div className="pf-mon-bottom">
                      <span className="pf-mon-owner">Maestro Pokémon • Pueblo Paleta, Kanto</span>
                      <svg width="17" height="16" viewBox="0 0 24 22" fill="#EF5552">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Lapras */}
                <div className="pf-mon-card">
                  <div className="pf-mon-img-wrap">
                    <img src={LAPRAS_IMG} alt="Lapras" />
                  </div>
                  <div className="pf-mon-body">
                    <div className="pf-mon-meta-row">
                      <div>
                        <p className="pf-add-fav-label">Añadir Favorito</p>
                        <p className="pf-mon-name">Lapras</p>
                      </div>
                      <div className="pf-tipos-row">
                        <span className="pf-tipo agua">AGUA</span>
                        <span className="pf-tipo hielo">HIELO</span>
                      </div>
                    </div>
                    <div className="pf-mon-bottom">
                      <span className="pf-mon-owner">Maestro Pokémon • Pueblo Paleta, Kanto</span>
                      <svg width="17" height="16" viewBox="0 0 24 22" fill="#EF5552">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Añadir */}
                <div className="pf-mon-card pf-mon-add-card">
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
            </div>

            {/* VIAJE DEL ENTRENADOR */}
            <div className="pf-viaje-section">
              <div className="pf-viaje-title-row">
                <svg width="22" height="20" viewBox="0 0 24 22" fill="#EF5552">
                  <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                </svg>
                <h2 className="pf-viaje-title">Viaje del Entrenador</h2>
              </div>
              <div className="pf-viaje-card">
                <p className="pf-viaje-text">
                  Soy Ash Ketchum, de Pueblo Paleta. Estoy viajando con mi compañero
                  Pikachu para convertirme en el mejor Maestro Pokémon del mundo. Hemos
                  viajado por Kanto, Johto, Hoenn y muchas otras regiones haciendo amigos
                  y enfrentando desafíos difíciles. ¡No importa lo difícil que sea, nunca
                  nos rendimos!
                </p>
                <div className="pf-tag-row">
                  {[
                    'Maestro Pokémon • Pueblo Paleta, Kanto',
                    'Maestro Pokémon • Pueblo Paleta, Kanto',
                    'Maestro Pokémon • Pueblo Paleta, Kanto',
                  ].map((t, i) => (
                    <span className="pf-region-tag" key={i}>{t}</span>
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