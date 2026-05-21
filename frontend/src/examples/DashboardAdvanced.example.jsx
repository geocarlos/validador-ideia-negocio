/**
 * Exemplo completo de uso com Dashboard
 * Mostra integração de autenticação com dados
 */

import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import apiService from '../services/apiService';
import Navbar from './Navbar.example';

const DashboardAdvanced = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [analysis, setAnalysis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Carregar análises ao montar ou quando usuário muda
  useEffect(() => {
    if (user && !authLoading) {
      fetchAnalysis();
    }
  }, [user, authLoading]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiService.listAnalysis();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar análises:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnalysis = async (ideaData) => {
    try {
      setLoading(true);
      const newAnalysis = await apiService.createAnalysis(ideaData);
      setAnalysis([newAnalysis, ...analysis]);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Erro ao criar análise:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnalysis = async (id) => {
    if (!confirm('Tem certeza que deseja deletar esta análise?')) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteAnalysis(id);
      setAnalysis(analysis.filter(a => a.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Erro ao deletar análise:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard de Análises
          </h1>
          <p className="text-gray-600">
            Usuário: <strong>{user?.email}</strong>
          </p>
        </div>

        {/* Mensagens */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">❌ {error}</p>
            <button
              onClick={() => setError('')}
              className="text-xs text-red-600 underline mt-2"
            >
              Descartar
            </button>
          </div>
        )}

        {/* Botão Criar */}
        <div className="mb-6">
          <button
            onClick={() => handleCreateAnalysis({ idea: 'Nova ideia' })}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md
              hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Criando...' : '+ Criar Análise'}
          </button>
        </div>

        {/* Lista de Análises */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">
                {loading ? 'Carregando análises...' : 'Nenhuma análise criada ainda'}
              </p>
            </div>
          ) : (
            analysis.map(item => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="font-bold text-gray-900 mb-2">
                  {item.title || 'Sem título'}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {item.description || 'Sem descrição'}
                </p>
                <div className="flex gap-2">
                  <button
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded
                      hover:bg-blue-200 transition text-sm"
                  >
                    Ver Análise
                  </button>
                  <button
                    onClick={() => handleDeleteAnalysis(item.id)}
                    disabled={loading}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded
                      hover:bg-red-200 transition text-sm disabled:opacity-50"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdvanced;
