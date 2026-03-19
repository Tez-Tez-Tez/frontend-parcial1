import { AuthProvider } from './context/AuthContext.jsx'
import { NavProvider, useNav } from './context/NavContext.jsx'
import { Navbar } from './components/Navbar.jsx'

import { PokemonPage } from './pages/PokemonPage.jsx'
import DetallePokemonPage from './pages/DetallePokemonPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import PerfilPage from './pages/PerfilPage.jsx'
import { useAuth } from './hooks/useAuth.js'
import './App.css'

function AppContent() {
  const { isAuthenticated } = useAuth()
  const { page, isSidebarOpen, closeSidebar, selectedPokemon } = useNav()
  
  // Determinar si debemos mostrar el navbar
  const showNavbar = isAuthenticated && page !== 'perfil'

  return (
    <div className="app">
      {showNavbar && <Navbar />}
      
      <main className={`app-main ${!showNavbar ? 'no-navbar' : ''}`}>
        {!isAuthenticated ? (
          <LoginPage />
        ) : page === 'perfil' ? (
          <PerfilPage />
        ) : page === 'detail' ? (
          <DetallePokemonPage key={selectedPokemon || 'detail'} />
        ) : (
          <PokemonPage />
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <NavProvider>
        <AppContent />
      </NavProvider>
    </AuthProvider>
  )
}

export default App
