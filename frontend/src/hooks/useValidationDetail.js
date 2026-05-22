/**
 * Hook para buscar detalhe de uma validação (GET /api/validacoes/:id).
 */

import { useState, useEffect, useCallback } from 'react';
import validationService from '../services/validationService';

const useValidationDetail = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchValidationDetail = useCallback(async () => {
    if (!id) {
      setError(new Error('ID de validação não fornecido'));
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await validationService.getValidationDetail(id);
      setData(result);
    } catch (err) {
      setError(err);
      console.error('Erro ao buscar detalhe de validação:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchValidationDetail();
  }, [fetchValidationDetail]);

  const refetch = useCallback(() => {
    fetchValidationDetail();
  }, [fetchValidationDetail]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export default useValidationDetail;
