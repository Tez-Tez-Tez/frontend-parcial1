/**
 * AuthContext.jsx
 * Contexto de Autenticación para gestión global del usuario
 */

/* eslint-disable react-refresh/only-export-components */

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

  const USERS_KEY = 'users';

  const getStoredUsers = useCallback(() => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      localStorage.removeItem(USERS_KEY);
      return [];
    }
  }, []);

  const setStoredUsers = useCallback((users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, []);

  /**
   * Iniciar sesión (función mock - simula autenticación)
   */
  const login = useCallback(async (identifier, password) => {
    setIsLoading(true);
    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validación básica
      if (!identifier || !password) {
        throw new Error('Usuario y contraseña son requeridos');
      }

      const users = getStoredUsers();
      const matchedUser = users.find(
        (u) =>
          u.username?.toLowerCase() === String(identifier).toLowerCase() ||
          (u.email && u.email.toLowerCase() === String(identifier).toLowerCase())
      );

      if (users.length > 0) {
        if (!matchedUser || matchedUser.password !== password) {
          throw new Error('Credenciales inválidas');
        }
      }

      // Simular usuario autenticado
      const displayName = matchedUser?.username || String(identifier);
      const email = matchedUser?.email || String(identifier);
      const userData = {
        id: matchedUser?.id || '1',
        email,
        username: matchedUser?.username || String(identifier),
        name: displayName,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=ff6b6b&color=fff`,
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
  }, [getStoredUsers]);

  /**
   * Registro (función mock - simula creación de usuario)
   */
  const register = useCallback(
    async ({ username, email, password }) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 900));

        if (!username || !password) {
          throw new Error('Usuario y contraseña son requeridos');
        }

        const normalizedUsername = String(username).trim();
        const normalizedEmail = email ? String(email).trim() : '';

        const users = getStoredUsers();
        const exists = users.some(
          (u) =>
            u.username?.toLowerCase() === normalizedUsername.toLowerCase() ||
            (normalizedEmail && u.email?.toLowerCase() === normalizedEmail.toLowerCase())
        );
        if (exists) {
          throw new Error('Ese usuario/email ya existe');
        }

        const newUser = {
          id: String(Date.now()),
          username: normalizedUsername,
          email: normalizedEmail,
          password,
          createdAt: new Date(),
        };

        setStoredUsers([...users, newUser]);

        const userData = {
          id: newUser.id,
          email: newUser.email || newUser.username,
          username: newUser.username,
          name: newUser.username,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.username)}&background=ff6b6b&color=fff`,
          role: 'user',
          loginTime: new Date(),
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        return userData;
      } catch (error) {
        console.error('Register error:', error.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [getStoredUsers, setStoredUsers]
  );

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
    register,
    logout,
    loadUserFromStorage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
