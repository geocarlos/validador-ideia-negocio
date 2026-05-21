/**
 * Formulário de login
 * Coleta email e faz autenticação
 */

import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const LoginForm = ({ onSuccess = null }) => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setLocalError('');

    // Validação básica
    if (!email.trim()) {
      setLocalError('Por favor, insira seu email');
      return;
    }

    if (!validateEmail(email)) {
      setLocalError('Por favor, insira um email válido');
      return;
    }

    try {
      await login(email);
      setEmail('');
      setSubmitted(false);

      // Callback opcional
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Erro já está no contexto, será exibido via {error}
      console.error('Login failed:', err);
    }
  };

  const displayError = localError || error;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Login
      </h2>

      {displayError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            ⚠️ {displayError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setLocalError(''); // Limpar erro ao digitar
            }}
            placeholder="seu-email@exemplo.com"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-md
            hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              Autenticando...
            </>
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {submitted && !loading && !displayError && (
          <span className="text-green-600">✓ Login realizado com sucesso!</span>
        )}
      </p>
    </div>
  );
};

export default LoginForm;
