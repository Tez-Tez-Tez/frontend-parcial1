// Pokémon data
const pokemonData = [
    { id: 6, name: 'Charizard', types: ['fire', 'flying'], gen: 1, stats: { hp: 78, atk: 84, def: 100 } },
    { id: 9, name: 'Blastoise', types: ['water'], gen: 1, stats: { hp: 79, atk: 83, def: 100 } },
    { id: 3, name: 'Venusaur', types: ['grass', 'poison'], gen: 1, stats: { hp: 80, atk: 82, def: 100 } },
    { id: 25, name: 'Pikachu', types: ['electric'], gen: 1, stats: { hp: 35, atk: 55, def: 90 } },
    { id: 143, name: 'Snorlax', types: ['normal'], gen: 1, stats: { hp: 160, atk: 70, def: 65 } },
    { id: 150, name: 'Mewtwo', types: ['psychic'], gen: 1, stats: { hp: 106, atk: 110, def: 104 } },
    { id: 24, name: 'Arcanine', types: ['fire'], gen: 1, stats: { hp: 90, atk: 110, def: 80 } },
    { id: 149, name: 'Dragonite', types: ['dragon', 'flying'], gen: 1, stats: { hp: 91, atk: 134, def: 95 } },
    { id: 94, name: 'Gengar', types: ['ghost', 'poison'], gen: 1, stats: { hp: 45, atk: 65, def: 105 } },
    { id: 131, name: 'Lapras', types: ['water', 'ice'], gen: 1, stats: { hp: 130, atk: 85, def: 80 } },
    { id: 38, name: 'Ninetales', types: ['fire'], gen: 1, stats: { hp: 73, atk: 76, def: 100 } },
    { id: 55, name: 'Golduck', types: ['water'], gen: 1, stats: { hp: 80, atk: 82, def: 100 } },
];

const itemsPerPage = 6;
let currentPage = 1;
let currentFilter = { type: 'all', value: null };
let favorites = [];

// Get Pokemon image URL from PokeAPI oficial artwork
function getPokemonImageUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/${id}.png`;
}

// Format Pokemon ID with zeros (e.g., 6 -> #0006)
function formatPokemonId(id) {
    return `#${String(id).padStart(4, '0')}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderPokemonCards();
    renderPagination();
    
    // Menu toggle
    document.getElementById('menu-toggle').addEventListener('click', function() {
        document.getElementById('menu').classList.toggle('open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const menu = document.getElementById('menu');
        const menuToggle = document.getElementById('menu-toggle');
        if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
            menu.classList.remove('open');
        }
    });
    
    // Search input
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterBySearch(searchTerm);
    });
});

function filterByAll() {
    currentFilter = { type: 'all', value: null };
    currentPage = 1;
    document.getElementById('searchInput').value = '';
    updateMenuButtons();
    renderPokemonCards();
    renderPagination();
    document.getElementById('menu').classList.remove('open');
}

function filterByFavorites() {
    currentFilter = { type: 'favorites', value: null };
    currentPage = 1;
    document.getElementById('searchInput').value = '';
    updateMenuButtons();
    renderPokemonCards();
    renderPagination();
    document.getElementById('menu').classList.remove('open');
}

function filterByGen(gen) {
    currentFilter = { type: 'gen', value: gen };
    currentPage = 1;
    document.getElementById('searchInput').value = '';
    updateMenuButtons();
    renderPokemonCards();
    renderPagination();
    document.getElementById('menu').classList.remove('open');
}

function filterByType(type) {
    currentFilter = { type: 'type', value: type };
    currentPage = 1;
    document.getElementById('searchInput').value = '';
    updateMenuButtons();
    renderPokemonCards();
    renderPagination();
    document.getElementById('menu').classList.remove('open');
}

function filterBySearch(searchTerm) {
    if (searchTerm.trim() === '') {
        currentFilter = { type: 'all', value: null };
    } else {
        currentFilter = { type: 'search', value: searchTerm };
    }
    currentPage = 1;
    renderPokemonCards();
    renderPagination();
}

function updateMenuButtons() {
    // Update nav buttons
    const navBtns = document.querySelectorAll('.menu-nav-btn');
    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if ((currentFilter.type === 'all' && btn.textContent === 'Todos los Pokémons') ||
            (currentFilter.type === 'favorites' && btn.textContent === 'Favoritos')) {
            btn.classList.add('active');
        }
    });
}

function getFilteredPokemon() {
    let filtered = pokemonData;
    
    if (currentFilter.type === 'gen') {
        filtered = filtered.filter(p => p.gen === currentFilter.value);
    } else if (currentFilter.type === 'type') {
        filtered = filtered.filter(p => p.types.includes(currentFilter.value));
    } else if (currentFilter.type === 'favorites') {
        filtered = filtered.filter(p => favorites.includes(p.id));
    } else if (currentFilter.type === 'search') {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(currentFilter.value));
    }
    
    return filtered;
}

function renderPokemonCards() {
    const grid = document.getElementById('pokemonGrid');
    grid.innerHTML = '';
    
    const filteredPokemon = getFilteredPokemon();
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pokemonToDisplay = filteredPokemon.slice(start, end);
    
    if (pokemonToDisplay.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #999;">No hay Pokémon en esta categoría</div>';
        return;
    }
    
    pokemonToDisplay.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        const isFavorite = favorites.includes(pokemon.id);
        
        const typesHTML = pokemon.types
            .map(type => `<span class="type-badge type-${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</span>`)
            .join('');
        
        card.innerHTML = `
            <span class="pokemon-id">${formatPokemonId(pokemon.id)}</span>
            <button class="favorite-btn ${isFavorite ? 'liked' : ''}" onclick="toggleFavorite(this, ${pokemon.id})">♡</button>
            <div class="pokemon-image-container">
                <img src="${getPokemonImageUrl(pokemon.id)}" alt="${pokemon.name}" class="pokemon-image" />
            </div>
            <h3 class="pokemon-name">${pokemon.name}</h3>
            <div class="pokemon-types">${typesHTML}</div>
            <div class="pokemon-stats">
                <div class="stat">
                    <span class="stat-label">HP</span>
                    <span class="stat-value">${pokemon.stats.hp}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">ATK</span>
                    <span class="stat-value">${pokemon.stats.atk}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">DEF</span>
                    <span class="stat-value">${pokemon.stats.def}</span>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    const filteredPokemon = getFilteredPokemon();
    const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);
    
    if (totalPages === 0) return;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '‹';
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderPokemonCards();
            renderPagination();
            window.scrollTo(0, 0);
        }
    };
    prevBtn.disabled = currentPage === 1;
    pagination.appendChild(prevBtn);
    
    // Page numbers
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-btn';
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.textContent = i;
        pageBtn.onclick = () => {
            currentPage = i;
            renderPokemonCards();
            renderPagination();
            window.scrollTo(0, 0);
        };
        pagination.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '›';
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPokemonCards();
            renderPagination();
            window.scrollTo(0, 0);
        }
    };
    nextBtn.disabled = currentPage === totalPages;
    pagination.appendChild(nextBtn);
}

function toggleFavorite(btn, pokemonId) {
    btn.classList.toggle('liked');
    
    if (favorites.includes(pokemonId)) {
        favorites = favorites.filter(id => id !== pokemonId);
    } else {
        favorites.push(pokemonId);
    }
}