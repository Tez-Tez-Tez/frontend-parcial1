import { AuthProvider } from './context/AuthContext.jsx'
import { Navbar } from './components/Navbar.jsx'
import { PokemonPage } from './pages/PokemonPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { useAuth } from './hooks/useAuth.js'
import './App.css'

function AppContent() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="app">
      <Navbar />
      <main className="app-main">
        {isAuthenticated ? <PokemonPage /> : <LoginPage />}
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
