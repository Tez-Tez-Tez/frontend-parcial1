/**
 * Navbar Component
 * Barra de navegación dinámica que cambia según estado de autenticación
 */

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import '../styles/Navbar.css';

export function Navbar({ onOpenLogin }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    setIsMenuOpen(false);
    onOpenLogin?.();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-logo-icon">🐾</span>
          <span className="navbar-title">PokéDex Pro</span>
        </div>

        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="#home" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="#pokemon" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Pokémon
              </a>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <a href="#dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </a>
              </li>
            )}
          </ul>

          <div className="navbar-auth">
            {isAuthenticated ? (
              <div className="user-profile">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar"
                  title={user.email}
                />
                <span className="user-name">{user.name}</span>
                <button className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button className="btn-login" onClick={handleLoginClick}>
                  Login
                </button>
                <button className="btn-signup" onClick={handleLoginClick}>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
