/**
 * App.jsx
 * Componente raíz de la aplicación SPA empresarial
 * Envuelve toda la aplicación con el AuthProvider para gestión global de autenticación
 */

import { useState, useEffect } from 'react'
import { AuthProvider } from './context/AuthContext.jsx'
import { Navbar } from './components/Navbar.jsx'
import { LoginModal } from './components/LoginModal.jsx'
import { PokemonPage } from './pages/PokemonPage.jsx'
import './App.css'

function AppContent() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const openLoginModal = () => setIsLoginModalOpen(true)
  const closeLoginModal = () => setIsLoginModalOpen(false)

  return (
    <div className="app">
      <Navbar onOpenLogin={openLoginModal} />
      <main className="app-main">
        <PokemonPage />
      </main>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
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
