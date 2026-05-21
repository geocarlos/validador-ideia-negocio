/**
 * Hook de validação de ideias.
 * Controla estado de loading, erro e resultado.
 */

import { useState, useCallback } from 'react';
import validationService from '../services/validationService';

const useValidation = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateIdea = useCallback(async (idea) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await validationService.validateIdea(idea);
      setResult(response);
      return response;
    } catch (err) {
      setError(err.message || 'Erro inesperado ao validar a ideia.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    result,
    loading,
    error,
    validateIdea,
  };
};

export default useValidation;
