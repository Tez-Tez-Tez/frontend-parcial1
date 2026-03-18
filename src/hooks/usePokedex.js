/**
 * Hook: usePokedex
 * Trae un listado de Pokémon desde la PokeAPI por generaciones.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import pokemonService from '../services/pokemonService.js';

export function usePokedex(options = {}) {
  const {
    generationIds = [1, 2, 3, 4, 5, 6, 7, 8, 9],
    perGeneration = 3,
  } = options;

  const key = useMemo(() => {
    const gens = Array.isArray(generationIds) ? generationIds : [generationIds];
    return `${gens.join(',')}|${perGeneration}`;
  }, [generationIds, perGeneration]);

  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPokedex = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const gens = Array.isArray(generationIds) ? generationIds : [generationIds];
      const data = await pokemonService.getPokemonsFromGenerations({
        generationIds: gens,
        perGeneration,
      });
      setPokemons(data);
    } catch (err) {
      setPokemons([]);
      setError(err.message || 'Error cargando la Pokedex');
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    fetchPokedex();
  }, [fetchPokedex]);

  return { pokemons, loading, error, refetch: fetchPokedex };
}
