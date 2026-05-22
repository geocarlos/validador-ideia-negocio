/**
 * Hook para DELETE de validações via validationService.
 */

import { useState, useCallback } from 'react';
import validationService from '../services/validationService';

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
      const id = endpoint.split('/').filter(Boolean).pop();
      const result = await validationService.deleteValidation(id);

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
