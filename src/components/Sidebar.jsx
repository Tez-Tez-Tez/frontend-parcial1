import { useNav } from '../context/NavContext.jsx';
import '../styles/Sidebar.css';

const navigationItems = [
  { id: 'all', label: 'Todos los Pokemones', icon: 'grid' },
  { id: 'recent', label: 'Descubrimientos Recientes', icon: 'clock' },
  { id: 'favorites', label: 'Favoritos', icon: 'star' },
];

const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const types = [
  { id: 'fire', label: 'FUEGO', tone: 'fire' },
  { id: 'water', label: 'AGUA', tone: 'water' },
  { id: 'grass', label: 'PLANTA', tone: 'grass' },
  { id: 'electric', label: 'ELECTRICO', tone: 'electric' },
  { id: 'psychic', label: 'PSIQUICO', tone: 'psychic' },
  { id: 'ice', label: 'HIELO', tone: 'ice' },
  { id: 'dragon', label: 'DRAGON', tone: 'dragon' },
  { id: 'ghost', label: 'FANTASMA', tone: 'ghost' },
  { id: 'fighting', label: 'LUCHA', tone: 'fighting' },
  { id: 'ground', label: 'TIERRA', tone: 'ground' },
  { id: 'rock', label: 'ROCA', tone: 'rock' },
  { id: 'normal', label: 'NORMAL', tone: 'normal' },
  { id: 'flying', label: 'VOLADOR', tone: 'flying' },
  { id: 'bug', label: 'BICHO', tone: 'bug' },
  { id: 'fairy', label: 'HADA', tone: 'fairy' },
  { id: 'steel', label: 'ACERO', tone: 'steel' },
  { id: 'dark', label: 'SINIESTRO', tone: 'dark' },
  { id: 'poison', label: 'VENENO', tone: 'poison' },
];

function SidebarIcon({ icon, active }) {
  const stroke = active ? '#ffffff' : '#94a3b8';

  if (icon === 'grid') {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="4.25" height="4.25" rx="1" stroke={stroke} strokeWidth="1.2" />
        <rect x="8.75" y="1" width="4.25" height="4.25" rx="1" stroke={stroke} strokeWidth="1.2" />
        <rect x="1" y="8.75" width="4.25" height="4.25" rx="1" stroke={stroke} strokeWidth="1.2" />
        <rect x="8.75" y="8.75" width="4.25" height="4.25" rx="1" stroke={stroke} strokeWidth="1.2" />
      </svg>
    );
  }

  if (icon === 'clock') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke={stroke} strokeWidth="1.8" />
        <path d="M12 7.5v5l3.25 1.75" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const {
    activeNavigation,
    activeGeneration,
    activeType,
    selectNavigation,
    selectGeneration,
    selectType,
  } = useNav();

  return (
    <>
      {isOpen && <div className="sb-overlay" onClick={onClose} />}

      <aside className={`sb-root ${isOpen ? 'sb-open' : ''}`} aria-hidden={!isOpen}>
        <div className="sb-inner">
          <section className="sb-group">
            <p className="sb-heading">NAVIGATION</p>

            <nav className="sb-nav" aria-label="Navegacion lateral">
              {navigationItems.map((item) => {
                const isActive = item.id === activeNavigation;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`sb-link ${isActive ? 'sb-link-active' : ''}`}
                    onClick={() => selectNavigation(item.id)}
                  >
                    <span className="sb-link-icon">
                      <SidebarIcon icon={item.icon} active={isActive} />
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </section>

          <section className="sb-group">
            <p className="sb-heading">GENERACION</p>

            <div className="sb-generation-grid">
              {generations.map((generation) => {
                const isActive = generation === activeGeneration;

                return (
                  <button
                    key={generation}
                    type="button"
                    className={`sb-generation ${isActive ? 'sb-generation-active' : ''}`}
                    onClick={() => selectGeneration(generation)}
                  >
                    {`GEN ${generation}`}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="sb-group sb-group-types">
            <p className="sb-heading">TIPOS</p>

            <div className="sb-type-list">
              {types.map((type) => {
                const isActive = type.id === activeType;

                return (
                  <button
                    key={type.id}
                    type="button"
                    className={`sb-type sb-type-${type.tone} ${isActive ? 'sb-type-active' : ''}`}
                    onClick={() => selectType(type.id)}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}