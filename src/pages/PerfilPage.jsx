import { useState, useEffect } from 'react'
import '../styles/Perfil.css'
import Sidebar from '../components/SidebarPerfil.jsx'
import { INITIAL_FAVORITES, DEFAULT_AVATAR } from '../utils/pokemonUtils'
import { SearchModal, EditModal } from '../components/profile/ProfileModals'
import { ProfileHeader, SidebarInterno, FavoritesSection, TrainerJourney } from '../components/profile/ProfileSections'
import { useNav } from '../context/NavContext.jsx'

export default function PerfilPage() {
  const { favoritePokemon: favoriteNames, toggleFavoritePokemon } = useNav()
  const [favoriteDetails, setFavoriteDetails] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Ash Ketchum',
      subtitle: 'Maestro Pokémon • Pueblo Paleta, Kanto',
      avatar: DEFAULT_AVATAR,
      bio: 'Soy Ash Ketchum, de Pueblo Paleta. Estoy viajando con mi compañero Pikachu para convertirme en el mejor Maestro Pokémon del mundo. Hemos viajado por Kanto, Johto, Hoenn y muchas otras regiones haciendo amigos y enfrentando desafíos difíciles. ¡No importa lo difícil que sea, nunca nos rendimos!',
      regions: ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Teselia', 'Kalos', 'Alola', 'Galar']
    };
  })

  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ ...profile })

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true)
      try {
        const promises = favoriteNames.map(name => 
          fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json())
        )
        const results = await Promise.all(promises)
        
        const pokemonData = results.map(pokemon => ({
          id: pokemon.id,
          name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
          image: pokemon.sprites.other['official-artwork'].front_default,
          types: pokemon.types.map(t => t.type.name)
        }))
        
        setFavoriteDetails(pokemonData)
      } catch (error) {
        console.error('Error loading favorites:', error)
      } finally {
        setLoading(false)
      }
    }
    loadFavorites()
  }, [favoriteNames])

  const searchPokemon = async (term) => {
    if (!term.trim()) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
      const data = await response.json()
      
      const filtered = data.results
        .filter(p => p.name.includes(term.toLowerCase()))
        .slice(0, 8)
      
      const details = await Promise.all(
        filtered.map(async (p) => {
          const res = await fetch(p.url)
          return await res.json()
        })
      )
      
      setSearchResults(details.map(d => ({
        id: d.id,
        name: d.name.charAt(0).toUpperCase() + d.name.slice(1),
        image: d.sprites.other['official-artwork'].front_default,
        types: d.types.map(t => t.type.name)
      })))
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setSearching(false)
    }
  }

  const addToFavorites = async (pokemon) => {
    if (favoriteNames.includes(pokemon.name.toLowerCase())) {
      alert('¡Este Pokémon ya está en favoritos!')
      return
    }
    
    toggleFavoritePokemon(pokemon.name)
    setShowSearch(false)
    setSearchTerm('')
    setSearchResults([])
  }

  const removeFromFavorites = (name, e) => {
    e.stopPropagation()
    toggleFavoritePokemon(name)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditForm({ ...editForm, avatar: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    setProfile(editForm)
    localStorage.setItem('userProfile', JSON.stringify(editForm))
    setShowEditModal(false)
    window.dispatchEvent(new Event('profileUpdated'))
  }

  return (
    <div className="pf-root">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <SearchModal 
        showSearch={showSearch} 
        setShowSearch={setShowSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPokemon={searchPokemon}
        searching={searching}
        searchResults={searchResults}
        addToFavorites={addToFavorites}
      />

      <EditModal 
        showEditModal={showEditModal} 
        setShowEditModal={setShowEditModal}
        editForm={editForm}
        setEditForm={setEditForm}
        handleAvatarChange={handleAvatarChange}
        handleSaveProfile={handleSaveProfile}
      />

      <ProfileHeader 
        profile={profile} 
        setSidebarOpen={setSidebarOpen} 
        setEditForm={setEditForm} 
        setShowEditModal={setShowEditModal} 
      />

      <div className="pf-bottom">
        <div className="pf-bottom-inner">
          <SidebarInterno setShowSearch={setShowSearch} />

          <div className="pf-right-col">
            <FavoritesSection 
              favoritePokemon={favoriteDetails} 
              loading={loading}
              removeFromFavorites={removeFromFavorites}
              setShowSearch={setShowSearch}
              profile={profile}
            />

            <TrainerJourney profile={profile} />
          </div>
        </div>
      </div>
    </div>
  )
}