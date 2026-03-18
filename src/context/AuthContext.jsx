import { createContext, useCallback, useMemo, useState } from 'react';

export const AuthContext = createContext();

function readUserFromStorage() {
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    return JSON.parse(storedUser);
  } catch (error) {
    console.error('Error loading user from storage:', error);
    localStorage.removeItem('user');
    return null;
  }
}

function getStoredUsers() {
  try {
    const users = localStorage.getItem('users');
    if (users) return JSON.parse(users);
  } catch (error) {
    console.error('Error loading users:', error);
  }
  
  // Create a default demo user if the list is empty
  const demoUser = {
    id: 'demo-1',
    username: 'demo',
    email: 'demo@example.com',
    password: 'demo',
    name: 'Entrenador Demo',
    avatar: 'https://ui-avatars.com/api/?name=Demo&background=667eea&color=fff',
    role: 'user',
  };
  
  localStorage.setItem('users', JSON.stringify([demoUser]));
  return [demoUser];
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readUserFromStorage());
  const [isLoading, setIsLoading] = useState(false);


  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!username || !password) {
        throw new Error('Usuario y contraseña son requeridos');
      }

      const users = getStoredUsers();
      const userMatch = users.find(
        (u) => (u.username === username || u.email === username) && u.password === password
      );

      if (!userMatch) {
        throw new Error('Credenciales incorrectas');
      }

      const userData = { ...userMatch, loginTime: new Date().toISOString() };
      delete userData.password; // Don't keep password in active session

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username, email, password) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const users = getStoredUsers();
      if (users.some((u) => u.username === username || u.email === email)) {
        throw new Error('El usuario o correo ya está registrado');
      }

      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password, // Almacenado de forma simple por ser una demo
        name: username,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=667eea&color=fff`,
        role: 'user',
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Auto-login after successful registration
      const userData = { ...newUser, loginTime: new Date().toISOString() };
      delete userData.password;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error('Register error:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
 
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);


  const loadUserFromStorage = useCallback(() => {
    setUser(readUserFromStorage());
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    loadUserFromStorage,
  }), [user, isLoading, login, register, logout, loadUserFromStorage]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
