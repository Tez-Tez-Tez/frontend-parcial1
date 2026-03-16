/**
 * LoginModal Component
 * Modal de login simple para demostración
 */

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth.js';
import '../styles/LoginModal.css';

export function LoginModal({ isOpen, onClose, variant = 'modal' }) {
  const { login, register: registerUser, isLoading } = useAuth();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = useMemo(
    () =>
      z.object({
        username: z.string().min(1, 'El usuario es requerido'),
        password: z.string().min(1, 'La contraseña es requerida'),
      }),
    []
  );

  const registerSchema = useMemo(
    () =>
      z
        .object({
          username: z
            .string()
            .min(3, 'El usuario debe tener al menos 3 caracteres')
            .max(30, 'El usuario no puede superar 30 caracteres'),
          email: z
            .string()
            .trim()
            .optional()
            .or(z.literal(''))
            .refine((v) => !v || z.string().email().safeParse(v).success, {
              message: 'Email inválido',
            }),
          password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
          confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
        })
        .refine((data) => data.password === data.confirmPassword, {
          path: ['confirmPassword'],
          message: 'Las contraseñas no coinciden',
        }),
    []
  );

  const schema = mode === 'register' ? registerSchema : loginSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      mode === 'register'
        ? { username: '', email: '', password: '', confirmPassword: '' }
        : { username: '', password: '' },
    mode: 'onBlur',
  });

  const busy = isLoading || isSubmitting;

  const onSubmit = async (data) => {
    setError('');

    try {
      if (mode === 'register') {
        await registerUser({
          username: data.username,
          email: data.email,
          password: data.password,
        });
      } else {
        await login(data.username, data.password);
      }

      reset();

      if (variant === 'modal') {
        onClose?.();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const switchMode = (nextMode) => {
    setError('');
    setShowPassword(false);
    setMode(nextMode);
    if (nextMode === 'register') {
      reset({ username: '', email: '', password: '', confirmPassword: '' });
    } else {
      reset({ username: '', password: '' });
    }
  };

  if (variant === 'modal' && !isOpen) return null;

  if (variant === 'page') {
    return (
      <div className="login-page">
        <header className="login-header">
          <div className="login-header-inner">
            <div className="login-brand" aria-label="PokeSPA">
              <span className="login-brand-badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" focusable="false" aria-hidden="true">
                  <path
                    d="M12 2 20 6.5v11L12 22 4 17.5v-11L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="login-brand-title">PokeSPA</span>
            </div>

            <button type="button" className="login-help-button" aria-label="Ayuda" title="Ayuda">
              <svg viewBox="0 0 24 24" width="18" height="18" focusable="false" aria-hidden="true">
                <path
                  d="M12 18.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 3a7 7 0 0 1 7 7c0 2.47-1.37 4.15-3.2 5.3-.8.5-1.3 1.23-1.3 2.2v.2h-2.3v-.35c0-1.77.88-2.95 2.25-3.8 1.35-.85 2.25-1.85 2.25-3.55a4.7 4.7 0 0 0-9.4 0H5a7 7 0 0 1 7-7Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </header>

        <main className="login-main">
          <section className="login-card" aria-label="Entrenadores Login">
            <div className="login-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" focusable="false" aria-hidden="true">
                <path
                  d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <h1 className="login-title">
              {mode === 'register' ? 'Registro de Entrenador' : 'Entrenadores Login'}
            </h1>
            <p className="login-subtitle">
              {mode === 'register'
                ? 'Crea tu cuenta para acceder al sistema.'
                : 'Introduzca sus credenciales para acceder a su sistema informatico.'}
            </p>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="login-form login-form--page">
              <div className="login-field">
                <label htmlFor="login-user" className="login-label">
                  Usuario
                </label>
                <div className="input-with-icon">
                  <span className="input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" focusable="false" aria-hidden="true">
                      <path
                        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="login-user"
                    className="login-input"
                    placeholder="Nombre"
                    disabled={busy}
                    {...register('username')}
                    autoComplete="username"
                  />
                </div>
                {errors.username?.message && (
                  <div className="field-error" role="alert">
                    {errors.username.message}
                  </div>
                )}
              </div>

              {mode === 'register' && (
                <div className="login-field">
                  <label htmlFor="login-email" className="login-label">
                    Email
                  </label>
                  <div className="input-with-icon">
                    <span className="input-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="16" height="16" focusable="false" aria-hidden="true">
                        <path
                          d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <input
                      type="email"
                      id="login-email"
                      className="login-input"
                      placeholder="tu@email.com"
                      disabled={busy}
                      {...register('email')}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email?.message && (
                    <div className="field-error" role="alert">
                      {errors.email.message}
                    </div>
                  )}
                </div>
              )}

              <div className="login-field">
                <label htmlFor="login-password" className="login-label">
                  Contraseña
                </label>
                <div className="input-with-icon">
                  <span className="input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" focusable="false" aria-hidden="true">
                      <path
                        d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2ZM10 6a2 2 0 0 1 4 0v2h-4V6Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    className="login-input"
                    placeholder="••••••••"
                    disabled={busy}
                    {...register('password')}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    disabled={busy}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" focusable="false" aria-hidden="true">
                      {showPassword ? (
                        <path
                          d="M12 5c5.5 0 9.5 5 10 7-.5 2-4.5 7-10 7S2.5 14 2 12c.5-2 4.5-7 10-7Zm0 3.2A3.8 3.8 0 1 0 15.8 12 3.8 3.8 0 0 0 12 8.2Zm0 2A1.8 1.8 0 1 1 10.2 12 1.8 1.8 0 0 1 12 10.2Z"
                          fill="currentColor"
                        />
                      ) : (
                        <path
                          d="M12 5c5.5 0 9.5 5 10 7-.5 2-4.5 7-10 7S2.5 14 2 12c.5-2 4.5-7 10-7Zm0 3.2A3.8 3.8 0 0 0 8.2 12c0 .6.13 1.16.36 1.66l1.49-1.49a1.8 1.8 0 0 1 2.5-2.5l1.49-1.49c-.5-.23-1.06-.36-1.66-.36Zm3.44.94-1.49 1.49c.23.5.36 1.06.36 1.66A3.8 3.8 0 0 1 12 15.8c-.6 0-1.16-.13-1.66-.36l-1.49 1.49c.94.54 2.03.87 3.15.87A5.8 5.8 0 0 0 17.8 12c0-1.12-.33-2.21-.87-3.15Z"
                          fill="currentColor"
                        />
                      )}
                    </svg>
                  </button>
                </div>

                {errors.password?.message && (
                  <div className="field-error" role="alert">
                    {errors.password.message}
                  </div>
                )}

                {mode === 'login' && (
                  <div className="forgot-row">
                    <a className="forgot-link" href="#" onClick={(e) => e.preventDefault()}>
                      ¿Has olvidado tu contraseña?
                    </a>
                  </div>
                )}
              </div>

              {mode === 'register' && (
                <div className="login-field">
                  <label htmlFor="login-confirm" className="login-label">
                    Confirmar contraseña
                  </label>
                  <div className="input-with-icon">
                    <span className="input-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="16" height="16" focusable="false" aria-hidden="true">
                        <path
                          d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2ZM10 6a2 2 0 0 1 4 0v2h-4V6Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-confirm"
                      className="login-input"
                      placeholder="••••••••"
                      disabled={busy}
                      {...register('confirmPassword')}
                      autoComplete="new-password"
                    />
                  </div>
                  {errors.confirmPassword?.message && (
                    <div className="field-error" role="alert">
                      {errors.confirmPassword.message}
                    </div>
                  )}
                </div>
              )}

              <button type="submit" className="login-submit" disabled={busy}>
                {busy ? 'Cargando...' : mode === 'register' ? 'Registrarse' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="login-bottom">
              {mode === 'register' ? (
                <>
                  <span>¿Ya tienes cuenta?</span>
                  <a
                    className="login-register-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      switchMode('login');
                    }}
                  >
                    Volver a iniciar sesión
                  </a>
                </>
              ) : (
                <>
                  <span>¿No tienes una cuenta?</span>
                  <a
                    className="login-register-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      switchMode('register');
                    }}
                  >
                    Registrarse como nuevo entrenador
                  </a>
                </>
              )}
            </div>

            <div className="login-footer">
              <div className="login-footer-links">
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Privacy Policy
                </a>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Terms of Service
                </a>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Support
                </a>
              </div>

              <p className="login-footer-copy">
                © 2024 PokePedia. Todos los derechos reservados. Data provided by PokeAPI.
              </p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="modal-title">Inicia Sesión</h2>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Usuario
            </label>
            <input
              type="text"
              id="email"
              className="form-input"
              placeholder="Nombre"
              disabled={busy}
              {...register('username')}
            />
            {errors.username?.message && (
              <div className="field-error" role="alert">
                {errors.username.message}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="form-input"
              placeholder="••••••••"
              disabled={busy}
              {...register('password')}
            />
            {errors.password?.message && (
              <div className="field-error" role="alert">
                {errors.password.message}
              </div>
            )}
          </div>

          <button type="submit" className="form-button" disabled={busy}>
            {busy ? 'Cargando...' : 'Inicia Sesión'}
          </button>
        </form>

        <p className="modal-hint">
          💡 Usa cualquier email/contraseña para demo (ej: demo@example.com / 123456)
        </p>
      </div>
    </div>
  );
}
