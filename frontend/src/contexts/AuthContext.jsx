/**
 * Contexto de autenticação
 */

import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        setLoading(true);
        const token = authService.getToken();

        if (token) {
          const isValid = await authService.validateToken();

          if (isValid) {
            const userData = authService.getUserFromToken();
            setUser(userData);
            setIsAuthenticated(true);
            setError(null);
          } else {
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
            setError('Sessão expirada');
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Erro ao restaurar sessão:', err);
        setError('Erro ao restaurar sessão');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(email);

      if (response.token) {
        const userData =
          response.user || authService.getUserFromToken();
        setUser(userData);
        setIsAuthenticated(true);
        return response;
      }

      throw new Error('Resposta de login inválida');
    } catch (err) {
      const errorMessage = err.message || 'Erro ao fazer login';
      setError(errorMessage);
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
