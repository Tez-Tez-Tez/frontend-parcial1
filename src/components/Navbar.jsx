import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNav } from '../context/NavContext.jsx';
import '../styles/Navbar.css';

export function Navbar({ onSearch }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { setPage, toggleSidebar, updateSearchQuery } = useNav();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const normalizedQuery = searchInput.trim();

    if (onSearch) {
      onSearch(normalizedQuery);
    } else {
      updateSearchQuery(normalizedQuery);
    }

    setSearchInput(normalizedQuery);
  };

  return (
    <header className="navbar">
      <div className="header-content">
        <div className="header-left">
          <button className="hamburger" onClick={toggleSidebar} aria-label="Menú">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <button
            className="header-logo-group"
            onClick={() => setPage('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div className="logo-box">📋</div>
            <div className="logo">PokéSPA</div>
          </button>
        </div>

        <div className="header-center">
          <form className="search-container" onSubmit={handleSearchSubmit}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Busca pokémon, movimientos, habilidad..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </div>

        <div className="header-right">
          <button
            className="navbar-help"
            type="button"
            aria-label="Ayuda"
            onClick={() => window.alert('Ayuda: inicia sesión para continuar.')}
          >
            ?
          </button>

          {isAuthenticated ? (
            <div className="navbar-user">
              <button
                className="user-avatar"
                type="button"
                title="Ver mi perfil"
                onClick={() => setPage('perfil')}
                aria-label="Ir a mi perfil"
                style={{
                  backgroundImage: `url(${
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || 'U'
                    )}&background=EF5552&color=fff`
                  })`,
                }}
              >
                {!user?.avatar && '👤'}
              </button>
              <button className="navbar-logout" type="button" onClick={logout}>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
