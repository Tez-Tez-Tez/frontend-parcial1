import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth.js';
import '../styles/LoginPage.css';

const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  email: z.string().email('Debe ser un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export function LoginPage() {
  const { login, register: authRegister, isLoading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const currentSchema = isRegistering ? registerSchema : loginSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data) => {
    setGlobalError('');
    try {
      if (isRegistering) {
        await authRegister(data.username.trim(), data.email.trim(), data.password);
      } else {
        await login(data.username.trim(), data.password);
      }
    } catch (err) {
      setGlobalError(err?.message || 'Hubo un error en la autenticación');
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setGlobalError('');
    reset();
  };

  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true" />

      <section className="login-card" aria-label="Formulario de login">
        <div className="login-card-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF5552" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <h1 className="login-title">
          {isRegistering ? 'Registro de Entrenador' : 'Entrenadores Login'}
        </h1>
        <p className="login-subtitle">
          {isRegistering
            ? 'Crea tu cuenta para acceder a tu Pokedex personalizada.'
            : 'Introduzca sus credenciales para acceder a su sistema informático.'}
        </p>

        {globalError ? <div className="login-error">{globalError}</div> : null}

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="login-field">
            <label className="login-label" htmlFor="username">
              Usuario
            </label>
            <div className="login-inputWrap">
              <span className="login-inputIcon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="username"
                className="login-input"
                {...register('username')}
                placeholder="Nombre"
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
            {errors.username && <p className="login-form-error" style={{ color: '#ff4d4f', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.username.message}</p>}
          </div>

          {isRegistering && (
            <div className="login-field">
              <label className="login-label" htmlFor="email">
                Correo Electrónico
              </label>
              <div className="login-inputWrap">
                <span className="login-inputIcon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  className="login-input"
                  {...register('email')}
                  placeholder="entrenador@pokemon.com"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="login-form-error" style={{ color: '#ff4d4f', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.email.message}</p>}
            </div>
          )}

          <div className="login-field">
            <label className="login-label" htmlFor="password">
              Contraseña
            </label>

            <div className="login-inputWrap">
              <span className="login-inputIcon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="password"
                className="login-input"
                {...register('password')}
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                disabled={isLoading}
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="login-form-error" style={{ color: '#ff4d4f', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.password.message}</p>}

            {!isRegistering && (
              <button
                type="button"
                className="login-forgot"
                onClick={() => setGlobalError('Tip: Para la demo, puedes crear una nueva cuenta.')}
                disabled={isLoading}
              >
                ¿Has olvidado tu contraseña?
              </button>
            )}
          </div>

          <button className="login-submit" type="submit" disabled={isLoading}>
            {isLoading
              ? (isRegistering ? 'Registrando…' : 'Iniciando…')
              : (isRegistering ? 'Crear e iniciar sesion' : 'Iniciar Sesión')}
          </button>
        </form>

        <p className="login-register">
          {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
          <button
            type="button"
            className="login-registerLink"
            onClick={toggleMode}
            disabled={isLoading}
          >
            {isRegistering ? 'Iniciar sesión aquí' : 'Registrarse como nuevo entrenador'}
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
