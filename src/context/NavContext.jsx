import { createContext, useContext, useMemo, useState } from 'react';

const NavContext = createContext();

const FAVORITES_STORAGE_KEY = 'pokespa:favorites';
const RECENT_STORAGE_KEY = 'pokespa:recent';

function readStoredList(storageKey) {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function writeStoredList(storageKey, value) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

export function NavProvider({ children }) {
  const [page, setPage] = useState('home'); // 'home' | 'perfil'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNavigation, setActiveNavigation] = useState('all');
  const [activeGeneration, setActiveGeneration] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('id-asc'); // Nuevo: ordenamiento
  const [favoritePokemon, setFavoritePokemon] = useState(() => readStoredList(FAVORITES_STORAGE_KEY));
  const [recentPokemon, setRecentPokemon] = useState(() => readStoredList(RECENT_STORAGE_KEY));
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((currentValue) => !currentValue);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const selectNavigation = (navigationId) => {
    setActiveNavigation(navigationId);
    if (navigationId === 'all') {
      setActiveGeneration(null);
      setActiveType(null);
    }
    setSearchQuery('');
    setPage('home');
    closeSidebar();
  };

  const selectGeneration = (generationId) => {
    setActiveGeneration((currentGeneration) => (currentGeneration === generationId ? null : generationId));
    setSearchQuery('');
    setPage('home');
    setActiveNavigation('all');
    closeSidebar();
  };

  const selectType = (typeId) => {
    setActiveType((currentType) => (currentType === typeId ? null : typeId));
    setSearchQuery('');
    setPage('home');
    setActiveNavigation('all');
    closeSidebar();
  };

  const updateSearchQuery = (query) => {
    setSearchQuery(String(query || '').trim().toLowerCase());
    setPage('home');
  };

  const updateSortBy = (sortOption) => {
    setSortBy(String(sortOption || 'id-asc'));
    setPage('home');
  };

  const toggleFavoritePokemon = (pokemonName) => {
    if (!pokemonName) {
      return;
    }

    setFavoritePokemon((currentFavorites) => {
      const normalizedName = String(pokemonName).toLowerCase();
      const nextFavorites = currentFavorites.includes(normalizedName)
        ? currentFavorites.filter((name) => name !== normalizedName)
        : [...currentFavorites, normalizedName];

      writeStoredList(FAVORITES_STORAGE_KEY, nextFavorites);
      return nextFavorites;
    });
  };

  const addRecentPokemon = (pokemonName) => {
    if (!pokemonName) {
      return;
    }

    setRecentPokemon((currentRecent) => {
      const normalizedName = String(pokemonName).toLowerCase();
      const nextRecent = [normalizedName, ...currentRecent.filter((name) => name !== normalizedName)].slice(0, 12);

      writeStoredList(RECENT_STORAGE_KEY, nextRecent);
      return nextRecent;
    });
  };

  const openPokemonDetail = (pokemonName) => {
    if (!pokemonName) {
      return;
    }

    const normalizedName = String(pokemonName).toLowerCase();
    setSelectedPokemon(normalizedName);
    addRecentPokemon(normalizedName);
    setPage('detail');
  };

  const closePokemonDetail = () => {
    setSelectedPokemon(null);
    setPage('home');
  };

  const value = useMemo(
    () => ({
      page,
      setPage,
      isSidebarOpen,
      toggleSidebar,
      closeSidebar,
      activeNavigation,
      activeGeneration,
      activeType,
      searchQuery,
      setSearchQuery,
      sortBy,
      favoritePokemon,
      recentPokemon,
      selectedPokemon,
      selectNavigation,
      selectGeneration,
      selectType,
      updateSearchQuery,
      updateSortBy,
      toggleFavoritePokemon,
      addRecentPokemon,
      openPokemonDetail,
      closePokemonDetail,
    }),
    [
      page,
      isSidebarOpen,
      activeNavigation,
      activeGeneration,
      activeType,
      searchQuery,
      sortBy,
      favoritePokemon,
      recentPokemon,
      selectedPokemon,
    ]
  );

  return (
    <NavContext.Provider value={value}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  return useContext(NavContext);
}
