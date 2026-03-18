/**
 * useAuth Hook
 * Hook personalizado para acceder al contexto de autenticación
 *
 * Uso:
 * const { user, isAuthenticated, login, logout } = useAuth()
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }

  return context;
}
