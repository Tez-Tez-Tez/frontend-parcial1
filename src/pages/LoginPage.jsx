import { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import '../styles/LoginPage.css';

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => {
    return !!username.trim() && !!password && !isLoading;
  }, [username, password, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(err?.message || 'No se pudo iniciar sesión');
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true" />

      <section className="login-card" aria-label="Formulario de login">
        <div className="login-card-icon" aria-hidden="true">
          <span className="login-card-icon-inner">👤</span>
        </div>

        <h1 className="login-title">Entrenadores Login</h1>
        <p className="login-subtitle">
          Introduzca sus credenciales para acceder a su sistema informático.
        </p>

        {error ? <div className="login-error">{error}</div> : null}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label" htmlFor="username">
              Usuario
            </label>
            <div className="login-inputWrap">
              <span className="login-inputIcon" aria-hidden="true">👤</span>
              <input
                id="username"
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nombre"
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="password">
              Contraseña
            </label>

            <div className="login-inputWrap">
              <span className="login-inputIcon" aria-hidden="true">🔒</span>
              <input
                id="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                disabled={isLoading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <button
              type="button"
              className="login-forgot"
              onClick={() => setError('Tip: en esta demo cualquier usuario/contraseña funciona.')}
              disabled={isLoading}
            >
              ¿Has olvidado tu contraseña?
            </button>
          </div>

          <button className="login-submit" type="submit" disabled={!canSubmit}>
            {isLoading ? 'Iniciando…' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="login-register">
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            className="login-registerLink"
            onClick={() => setError('Demo: el registro no está implementado en este parcial.')}
            disabled={isLoading}
          >
            Registrarse como nuevo entrenador
          </button>
        </p>

        <footer className="login-links" aria-label="Links legales">
          <a className="login-link" href="#privacy" onClick={(e) => e.preventDefault()}>
            Privacy Policy
          </a>
          <a className="login-link" href="#terms" onClick={(e) => e.preventDefault()}>
            Terms of Service
          </a>
          <a className="login-link" href="#support" onClick={(e) => e.preventDefault()}>
            Support
          </a>
        </footer>
      </section>

      <p className="login-copyright">
        © 2026 PokePedia. Todos los derechos reservados. Data provided by PokeAPI.
      </p>
    </div>
  );
}
