import { AuthProvider } from './context/AuthContext.jsx'
import { NavProvider, useNav } from './context/NavContext.jsx'
import { Navbar } from './components/Navbar.jsx'
import { PokemonPage } from './pages/PokemonPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import PerfilPage from './pages/PerfilPage.jsx'
import { useAuth } from './hooks/useAuth.js'
import './App.css'

function AppContent() {
  const { isAuthenticated } = useAuth()
  const { page } = useNav()

  return (
    <div className="app">
      {isAuthenticated && <Navbar />}
      <main className="app-main">
        {!isAuthenticated ? (
          <LoginPage />
        ) : page === 'perfil' ? (
          <PerfilPage />
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
