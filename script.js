// =============================================
// CONFIG
// =============================================
const ITEMS_PER_PAGE = 12;
const CACHE = {};       // { gen: [pokemonObj, ...] }

let allPokemon = [];    // Pokémon del filtro activo
let currentPage = 1;
let currentFilter = { type: 'all', value: null };
let currentGen = null;   // null = todas las generaciones ya cargadas juntas
let favorites = JSON.parse(localStorage.getItem('pokeFavs') || '[]');
let isLoading = false;

// Rangos de IDs por generación (para cargar "todos" sin esperar gen endpoint)
const GEN_RANGES = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
    4: [387, 493],
    5: [494, 649],
    6: [650, 721],
    7: [722, 809],
    8: [810, 905],
    9: [906, 1025],
};

// =============================================
// UTILIDADES
// =============================================
function getPokemonImageUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function getFallbackImageUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function formatPokemonId(id) {
    return `#${String(id).padStart(4, '0')}`;
}

function showLoading(show) {
    let loader = document.getElementById('loadingIndicator');
    if (show) {
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loadingIndicator';
            loader.innerHTML = `
                <div class="loader-spinner"></div>
                <p>Cargando Pokémon...</p>
            `;
            loader.style.cssText = `
                grid-column: 1/-1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 3rem;
                color: #999;
                gap: 1rem;
            `;
            document.getElementById('pokemonGrid').appendChild(loader);
        }
        document.getElementById('pokemonGrid').innerHTML = '';
        document.getElementById('pokemonGrid').appendChild(loader);
        document.getElementById('pagination').innerHTML = '';
    } else {
        if (loader) loader.remove();
    }
}

// =============================================
// FETCH DE LA POKEAPI
// =============================================

// Obtiene los datos de un Pokémon individual
async function fetchPokemon(idOrName) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
    if (!res.ok) throw new Error(`No se pudo cargar Pokémon: ${idOrName}`);
    const data = await res.json();
    return {
        id: data.id,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        types: data.types.map(t => t.type.name),
        stats: {
            hp:  data.stats.find(s => s.stat.name === 'hp')?.base_stat ?? 0,
            atk: data.stats.find(s => s.stat.name === 'attack')?.base_stat ?? 0,
            def: data.stats.find(s => s.stat.name === 'defense')?.base_stat ?? 0,
        },
        gen: getGenByid(data.id),
    };
}

// Determina la generación según el ID
function getGenByid(id) {
    for (const [gen, [min, max]] of Object.entries(GEN_RANGES)) {
        if (id >= min && id <= max) return Number(gen);
    }
    return null;
}

// Carga todos los Pokémon de una generación (con caché)
async function loadGen(gen) {
    if (CACHE[gen]) return CACHE[gen];

    const [min, max] = GEN_RANGES[gen];
    const ids = [];
    for (let i = min; i <= max; i++) ids.push(i);

    // Fetch en paralelo con lotes de 20 para no saturar la API
    const results = [];
    const BATCH = 20;
    for (let i = 0; i < ids.length; i += BATCH) {
        const batch = ids.slice(i, i + BATCH);
        const batch_results = await Promise.allSettled(batch.map(id => fetchPokemon(id)));
        batch_results.forEach(r => {
            if (r.status === 'fulfilled') results.push(r.value);
        });
    }

    CACHE[gen] = results.sort((a, b) => a.id - b.id);
    return CACHE[gen];
}

// =============================================
// FILTROS
// =============================================
function getFilteredPokemon() {
    let filtered = allPokemon;

    if (currentFilter.type === 'type') {
        filtered = filtered.filter(p => p.types.includes(currentFilter.value));
    } else if (currentFilter.type === 'favorites') {
        filtered = filtered.filter(p => favorites.includes(p.id));
    } else if (currentFilter.type === 'search') {
        const term = currentFilter.value.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(term) ||
            String(p.id).includes(term)
        );
    }

    return filtered;
}

// =============================================
// RENDER
// =============================================
function renderPokemonCards() {
    const grid = document.getElementById('pokemonGrid');
    grid.innerHTML = '';

    const filtered = getFilteredPokemon();
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const toShow = filtered.slice(start, end);

    if (toShow.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:#999;">No hay Pokémon en esta categoría</div>';
        return;
    }

    toShow.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        const isFav = favorites.includes(pokemon.id);

        const typesHTML = pokemon.types
            .map(t => `<span class="type-badge type-${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</span>`)
            .join('');

        card.innerHTML = `
            <span class="pokemon-id">${formatPokemonId(pokemon.id)}</span>
            <button class="favorite-btn ${isFav ? 'liked' : ''}" onclick="toggleFavorite(this, ${pokemon.id})">♡</button>
            <div class="pokemon-image-container">
                <img
                    src="${getPokemonImageUrl(pokemon.id)}"
                    alt="${pokemon.name}"
                    class="pokemon-image"
                    onerror="this.onerror=null;this.src='${getFallbackImageUrl(pokemon.id)}';"
                />
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

    const filtered = getFilteredPokemon();
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    if (totalPages <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '‹';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderPokemonCards(); renderPagination(); window.scrollTo(0,0); }};
    pagination.appendChild(prevBtn);

    const MAX_BTNS = 5;
    let startPage = Math.max(1, currentPage - Math.floor(MAX_BTNS / 2));
    let endPage = Math.min(totalPages, startPage + MAX_BTNS - 1);
    if (endPage - startPage < MAX_BTNS - 1) startPage = Math.max(1, endPage - MAX_BTNS + 1);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
        btn.textContent = i;
        btn.onclick = () => { currentPage = i; renderPokemonCards(); renderPagination(); window.scrollTo(0,0); };
        pagination.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '›';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderPokemonCards(); renderPagination(); window.scrollTo(0,0); }};
    pagination.appendChild(nextBtn);
}

// =============================================
// ACCIONES DE FILTRO
// =============================================
async function filterByGen(gen) {
    if (isLoading) return;
    isLoading = true;
    currentFilter = { type: 'all', value: null };
    currentPage = 1;
    document.getElementById('searchInput').value = '';
    document.getElementById('menu').classList.remove('open');
    updateMenuButtons();
    showLoading(true);
    try {
        allPokemon = await loadGen(gen);
    } catch (e) {
        console.error(e);
        document.getElementById('pokemonGrid').innerHTML =
            '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:#f66;">Error al cargar la generación. Intenta de nuevo.</div>';
        isLoading = false;
        return;
    }
    showLoading(false);
    renderPokemonCards();
    renderPagination();
    isLoading = false;
}

async function filterByAll() {
    if (isLoading) return;
    isLoading = true;
    currentFilter = { type: 'all', value: null };
    currentPage = 1;
    document.getElementById('searchInput').value = '';
    document.getElementById('menu').classList.remove('open');
    updateMenuButtons();
    showLoading(true);
    try {
        allPokemon = await loadGen(1);
    } catch (e) {
        console.error(e);
    }
    showLoading(false);
    renderPokemonCards();
    renderPagination();
    isLoading = false;
}

function filterByFavorites() {
    currentFilter = { type: 'favorites', value: null };
    currentPage = 1;
    document.getElementById('searchInput').value = '';
    document.getElementById('menu').classList.remove('open');
    updateMenuButtons();
    renderPokemonCards();
    renderPagination();
}

function filterByType(type) {
    currentFilter = { type: 'type', value: type };
    currentPage = 1;
    document.getElementById('searchInput').value = '';
    document.getElementById('menu').classList.remove('open');
    renderPokemonCards();
    renderPagination();
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
    document.querySelectorAll('.menu-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (currentFilter.type === 'all' && btn.textContent === 'Todos los Pokémons') btn.classList.add('active');
        if (currentFilter.type === 'favorites' && btn.textContent === 'Favoritos') btn.classList.add('active');
    });
}

// =============================================
// FAVORITOS
// =============================================
function toggleFavorite(btn, pokemonId) {
    btn.classList.toggle('liked');
    if (favorites.includes(pokemonId)) {
        favorites = favorites.filter(id => id !== pokemonId);
    } else {
        favorites.push(pokemonId);
    }
    localStorage.setItem('pokeFavs', JSON.stringify(favorites));
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', async function () {
    // Agregar estilos del spinner si no existen
    if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = `
            @keyframes spin { to { transform: rotate(360deg); } }
            .loader-spinner {
                width: 48px; height: 48px;
                border: 5px solid rgba(255,255,255,0.15);
                border-top-color: #e63946;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }
        `;
        document.head.appendChild(style);
    }

    // Menú hamburguesa
    document.getElementById('menu-toggle').addEventListener('click', function () {
        document.getElementById('menu').classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
        const menu = document.getElementById('menu');
        const toggle = document.getElementById('menu-toggle');
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove('open');
        }
    });

    // Buscador
    document.getElementById('searchInput').addEventListener('input', function (e) {
        filterBySearch(e.target.value.toLowerCase());
    });

    // Carga inicial: Generación 1
    showLoading(true);
    try {
        allPokemon = await loadGen(1);
    } catch (e) {
        console.error('Error en carga inicial:', e);
        document.getElementById('pokemonGrid').innerHTML =
            '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:#f66;">Error al conectar con la PokéAPI. Verifica tu conexión.</div>';
        isLoading = false;
        return;
    }
    showLoading(false);
    renderPokemonCards();
    renderPagination();
});