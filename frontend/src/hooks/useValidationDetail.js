/**
 * useValidationDetail - Hook para buscar detalhe de uma validação específica
 * 
 * Responsabilidades:
 * - Buscar validação por ID no endpoint GET /api/validacoes/:id
 * - Gerenciar estados: loading, error, data
 * - Refetch manual (para atualizar dados)
 * - Tratamento de erros consistent
 * 
 * @param {string} id - ID da validação a buscar
 * @returns {Object} { data, loading, error, refetch }
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import validationService from '../services/validationService';

const useValidationDetail = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref para tracking de montagem (evitar memory leak)
  const isMountedRef = useRef(true);

  // Função de fetch encapsulada
  const fetchValidationDetail = useCallback(async () => {
    if (!id) {
      setError(new Error('ID de validação não fornecido'));
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Adicionar método ao validationService se não existir
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/validacoes/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(
          payload.message || `Erro ao buscar validação: ${response.status}`
        );
      }

      const result = await response.json();

      if (isMountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err);
        console.error('Erro ao buscar detalhe de validação:', err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [id]);

  // Fetch ao montar ou quando ID muda
  useEffect(() => {
    fetchValidationDetail();

    return () => {
      // Cleanup para evitar memory leak
      isMountedRef.current = false;
    };
  }, [fetchValidationDetail]);

  // Refetch manual
  const refetch = useCallback(() => {
    isMountedRef.current = true;
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
