import { useAuth } from '../hooks/useAuth.js';
import '../styles/Navbar.css';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" aria-label="PokeSPA">
          <span className="navbar-logo" aria-hidden="true">⬣</span>
          <span className="navbar-title">PokeSPA</span>
        </div>

        <div className="navbar-right">
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
              <span className="navbar-username" title={user?.email}>
                {user?.name}
              </span>
              <button className="navbar-logout" type="button" onClick={logout}>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
