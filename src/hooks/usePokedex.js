/**
 * Hook: usePokedex
 * Trae un listado de Pokémon desde la PokeAPI por generaciones.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import pokemonService from '../services/pokemonService.js';

export function usePokedex(options = {}) {
  const {
    mode = 'all',
    names = [],
    generationIds = [1, 2, 3, 4, 5, 6, 7, 8, 9],
    typeId = null,
    searchQuery = '',
    page = 1,
    pageSize = 20,
  } = options;

  const key = useMemo(() => {
    const gens = Array.isArray(generationIds) ? generationIds : [generationIds];
    const namesKey = Array.isArray(names) ? names.join(',') : '';
    return `${mode}|${gens.join(',')}|${typeId ?? 'all'}|${String(searchQuery).trim().toLowerCase()}|${page}|${pageSize}|${namesKey}`;
  }, [generationIds, mode, names, page, pageSize, searchQuery, typeId]);

  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPokedex = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const gens = Array.isArray(generationIds) ? generationIds : [generationIds];
      const data = mode === 'favorites' || mode === 'recent'
        ? await pokemonService.getPokemonsByNames({
            names,
            generationIds: gens,
            typeId,
            searchQuery,
            page,
            pageSize,
          })
        : await pokemonService.getPokemonsPageFromGenerations({
            generationIds: gens,
            typeId,
            searchQuery,
            page,
            pageSize,
          });

      setPokemons(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setPokemons([]);
      setTotal(0);
      setTotalPages(1);
      setError(err.message || 'Error cargando la Pokedex');
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    fetchPokedex();
  }, [fetchPokedex]);

  return { pokemons, loading, error, total, totalPages, refetch: fetchPokedex };
}
