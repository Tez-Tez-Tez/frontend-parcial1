/**
 * Hook personalizado para obtener datos de Pokémon
 * Maneja estado, carga y errores
 */

import { useState, useEffect, useCallback } from 'react';
import pokemonService from '../services/pokemonService.js';

export function usePokemon(initialNameOrId = null) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPokemon = useCallback(async (nameOrId) => {
    if (!nameOrId) {
      setError('Please provide a Pokémon name or ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await pokemonService.getPokemon(nameOrId);
      setPokemon(data);
    } catch (err) {
      setError(err.message);
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialNameOrId) {
      fetchPokemon(initialNameOrId);
    }
  }, [initialNameOrId, fetchPokemon]);

  const refetch = useCallback((nameOrId) => {
    fetchPokemon(nameOrId);
  }, [fetchPokemon]);

  return { pokemon, loading, error, refetch };
}
