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


export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readUserFromStorage());
  const [isLoading, setIsLoading] = useState(false);


  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    try {

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!username || !password) {
        throw new Error('Usuario y contraseña son requeridos');
      }

      const safeName = String(username).trim();


      const userData = {
        id: '1',
        email: safeName,
        name: safeName.includes('@') ? safeName.split('@')[0] : safeName,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          safeName.includes('@') ? safeName.split('@')[0] : safeName
        )}&background=667eea&color=fff`,
        role: 'user',
        loginTime: new Date().toISOString(),
      };

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
    logout,
    loadUserFromStorage,
  }), [user, isLoading, login, logout, loadUserFromStorage]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
