import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNav } from '../context/NavContext.jsx';
import '../styles/Navbar.css';

export function Navbar({ onSearch }) {
  const { user, isAuthenticated } = useAuth();
  const { setPage, toggleSidebar, updateSearchQuery } = useNav();
  const [searchInput, setSearchInput] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/Ash.png');

  useEffect(() => {
    const loadAvatar = () => {
      try {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          if (profile.avatar) {
            setAvatarUrl(profile.avatar);
          } else {
            setAvatarUrl('/Ash.png');
          }
        } else {
          setAvatarUrl('/Ash.png');
        }
      } catch (error) {
        console.error('Error loading profile avatar:', error);
        setAvatarUrl('/Ash.png');
      }
    };

    loadAvatar();

    const handleStorageChange = (e) => {
      if (e.key === 'userProfile') loadAvatar();
    };
    const handleProfileUpdate = () => loadAvatar();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

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
          {/* Hamburger */}
          <button className="hamburger" onClick={toggleSidebar} aria-label="Menú">
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Logo */}
          <button
            className="header-logo-group"
            onClick={() => setPage('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div className="logo-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                <line x1="3" y1="12" x2="21" y2="12" stroke="white" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" fill="white" />
                <circle cx="12" cy="12" r="2" fill="#EF5552" />
              </svg>
            </div>
            <div className="logo">PokéSPA</div>
          </button>
        </div>

        {/* Search */}
        <div className="header-center">
          <form className="search-container" onSubmit={handleSearchSubmit}>
            {/* Magnifier icon */}
            <svg className="search-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Busca pokémon, movimientos, habilidad..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </div>

        {/* Right */}
        <div className="header-right">
          {/* Question / help */}
          <button
            className="navbar-help"
            type="button"
            aria-label="Ayuda"
            onClick={() => window.alert('Ayuda: inicia sesión para continuar.')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
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
                  backgroundImage: `url(${avatarUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  style={{ display: 'none' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const button = e.target.closest('.user-avatar');
                    if (button) {
                      button.style.backgroundImage = `url(https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.name || 'U'
                      )}&background=EF5552&color=fff)`;
                    }
                  }}
                />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}