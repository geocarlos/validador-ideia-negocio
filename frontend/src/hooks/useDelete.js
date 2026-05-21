/**
 * useDelete - Hook reutilizável para operações DELETE
 * 
 * Responsabilidades:
 * - Fazer requisição DELETE para qualquer endpoint
 * - Gerenciar loading e error states
 * - Chamar callback de sucesso/erro
 * - Totalmente genérico e reutilizável
 * 
 * @param {string} endpoint - Endpoint a deletar (ex: /validacoes/123)
 * @param {Object} options - Opções
 * @param {function} [options.onSuccess] - Callback após sucesso
 * @param {function} [options.onError] - Callback após erro
 * @returns {Object} { loading, error, deleteItem, clearError }
 */

import { useState, useCallback } from 'react';

const useDelete = (endpoint, { onSuccess, onError } = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteItem = useCallback(async () => {
    if (!endpoint) {
      const err = new Error('Endpoint não fornecido');
      setError(err);
      onError?.(err);
      throw err;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const url = endpoint.startsWith('/') ? `${apiUrl}${endpoint}` : endpoint;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const errorMessage = payload.message || `Erro ao deletar: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json().catch(() => ({ success: true }));

      setLoading(false);
      onSuccess?.(result);
      return result;
    } catch (err) {
      setLoading(false);
      setError(err);
      onError?.(err);
      throw err;
    }
  }, [endpoint, onSuccess, onError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    deleteItem,
    clearError,
  };
};

export default useDelete;
