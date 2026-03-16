import { createContext, useContext, useState } from 'react';

const NavContext = createContext();

export function NavProvider({ children }) {
  const [page, setPage] = useState('home'); // 'home' | 'perfil'
  return (
    <NavContext.Provider value={{ page, setPage }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  return useContext(NavContext);
}
