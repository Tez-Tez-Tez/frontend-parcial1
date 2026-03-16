/**
 * App.jsx
 * Componente raíz de la aplicación SPA empresarial
 * Envuelve toda la aplicación con el AuthProvider para gestión global de autenticación
 */

import { useState, useEffect } from 'react'
import { AuthProvider } from './context/AuthContext.jsx'
import { useAuth } from './hooks/useAuth.js'
import { Navbar } from './components/Navbar.jsx'
import { LoginModal } from './components/LoginModal.jsx'
import { PokemonPage } from './pages/PokemonPage.jsx'
import './App.css'

function AppContent() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const { isAuthenticated, loadUserFromStorage } = useAuth()

  useEffect(() => {
    loadUserFromStorage?.()
  }, [loadUserFromStorage])

  const openLoginModal = () => setIsLoginModalOpen(true)
  const closeLoginModal = () => setIsLoginModalOpen(false)

  if (!isAuthenticated) {
    return (
      <div className="app">
        <LoginModal variant="page" />
      </div>
    )
  }

  return (
    <div className="app">
      <Navbar onOpenLogin={openLoginModal} />
      <main className="app-main">
        <PokemonPage />
      </main>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} variant="modal" />
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
