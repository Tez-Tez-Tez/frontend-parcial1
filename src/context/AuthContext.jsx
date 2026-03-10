/**
 * AuthContext.jsx
 * Contexto de Autenticación para gestión global del usuario
 */

import { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

/**
 * AuthProvider
 * Proveedor de autenticación para toda la aplicación
 *
 * Proporciona:
 * - user: Datos del usuario autenticado o null
 * - isAuthenticated: Boolean indicando si hay sesión activa
 * - login: Función para iniciar sesión
 * - logout: Función para cerrar sesión
 * - isLoading: Estado de carga
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Iniciar sesión (función mock - simula autenticación)
   */
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validación básica
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      // Simular usuario autenticado
      const userData = {
        id: '1',
        email,
        name: email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=667eea&color=fff`,
        role: 'user',
        loginTime: new Date(),
      };

      setUser(userData);
      // Guardar en localStorage para persistencia
      localStorage.setItem('user', JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Cerrar sesión
   */
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  /**
   * Cargar usuario desde localStorage (persist)
   */
  const loadUserFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      localStorage.removeItem('user');
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    loadUserFromStorage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
