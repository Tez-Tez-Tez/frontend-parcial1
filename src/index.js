/**
 * Index Principal
 * Punto de entrada para la aplicación
 * 
 * Estructura:
 * - components/   → Componentes reutilizables
 * - pages/        → Páginas principales de la app
 * - hooks/        → Hooks personalizados
 * - services/     → Servicios de API y lógica business
 * - context/      → Contextos globales (AuthContext, etc)
 * - utils/        → Funciones utilitarias
 * - constants/    → Constantes y configuración
 * - styles/       → Estilos CSS globales
 */

// Components
export { Navbar } from './components/Navbar.jsx'
export { LoginModal } from './components/LoginModal.jsx'
export { PokemonCard } from './components/PokemonCard.jsx'
export { PokemonSearch } from './components/PokemonSearch.jsx'
export { LoadingSpinner } from './components/LoadingSpinner.jsx'
export { ErrorMessage } from './components/ErrorMessage.jsx'

// Pages
export { PokemonPage } from './pages/DetallePokemon.jsx'

// Hooks
export { usePokemon } from './hooks/usePokemon.js'
export { useAuth } from './hooks/useAuth.js'

// Context
export { AuthContext, AuthProvider } from './context/AuthContext.jsx'

// Services
export { default as pokemonService } from './services/pokemonService.js'
export { default as apiClient } from './services/apiClient.js'

// Utils
export { formatters } from './utils/formatters.js'

// Constants
export { API_CONFIG, API_ENDPOINTS } from './constants/api.js'
