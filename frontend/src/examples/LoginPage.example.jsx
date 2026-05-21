/**
 * Página de Login
 * Exemplo de implementação da página de login
 */

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Se já está autenticado, redirecionar para dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    // Redirecionar para dashboard após login bem-sucedido
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 Validador Avançado
          </h1>
          <p className="text-gray-600">
            Análise inteligente de ideias de negócio
          </p>
        </div>

        <LoginForm onSuccess={handleLoginSuccess} />

        <div className="mt-8 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-gray-700">
            <strong>Teste:</strong> Use um email qualquer para fazer login
            (exemplo: teste@exemplo.com)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
