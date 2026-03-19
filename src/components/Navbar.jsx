import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNav } from '../context/NavContext.jsx';
import '../styles/Navbar.css';

export function Navbar({ onSearch }) {
  const { user, isAuthenticated } = useAuth();
  const { setPage, toggleSidebar, updateSearchQuery } = useNav();
  const [searchInput, setSearchInput] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('../public/Ash.png'); // Por defecto Ash

  // Actualizar avatar cuando cambie en localStorage
  useEffect(() => {
    const loadAvatar = () => {
      try {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          if (profile.avatar && profile.avatar !== '../public/Ash.png') {
            setAvatarUrl(profile.avatar);
          } else {
            setAvatarUrl('../public/Ash.png');
          }
        } else {
          setAvatarUrl('../public/Ash.png');
        }
      } catch (error) {
        console.error('Error loading profile avatar:', error);
        setAvatarUrl('../public/Ash.png');
      }
    };

    // Cargar avatar inicial
    loadAvatar();

    // Escuchar cambios en localStorage (cuando se guarda perfil)
    const handleStorageChange = (e) => {
      if (e.key === 'userProfile') {
        loadAvatar();
      }
    };

    // Escuchar evento personalizado de actualización de perfil
    const handleProfileUpdate = () => {
      loadAvatar();
    };

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
          <button
            className="header-logo-group"
            onClick={() => setPage('home')}
          >
            <div className="logo-box">
              <div className="logo-icon-container">
                <div className="logo-icon"></div>
              </div>
            </div>
            <div className="logo-text-container">
              <h2 className="logo">PokéSPA</h2>
            </div>
          </button>
        </div>

        <div className="header-center">
          <form className="search-container" onSubmit={handleSearchSubmit}>
            <div className="search-icon-container">
              <div className="search-icon"></div>
            </div>
            <div className="search-input-container">
              <input
                type="text"
                className="search-input"
                placeholder="Busca pokemon, movimientos, habili..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </form>
        </div>

        <div className="header-right">


          {isAuthenticated ? (
            <div className="navbar-user">
              <button
                className="user-avatar"
                type="button"
                title="Ver mi perfil"
                onClick={() => setPage('perfil')}
                aria-label="Ir a mi perfil"
                style={{
                  backgroundImage: `url(${avatarUrl})`
                }}
              >
                {/* Si la imagen falla, mostrar inicial */}
                <img 
                  src={avatarUrl}
                  alt="Avatar"
                  style={{ display: 'none' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    // Si falla la carga, mostrar inicial
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