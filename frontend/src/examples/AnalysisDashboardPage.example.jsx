/**
 * Integração com Componente AnalysisDashboard Existente
 * Mostra como usar o componente existing com autenticação
 */

import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import apiService from '../services/apiService';
import Navbar from '../examples/Navbar.example';
import AnalysisDashboard from '../components/AnalysisDashboard';

const AnalysisDashboardPage = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && !authLoading) {
      // Carregar dados iniciais se necessário
      loadAnalysisData();
    }
  }, [user, authLoading]);

  const loadAnalysisData = async () => {
    try {
      setLoading(true);
      // Exemplo: chamar API para obter análises
      const data = await apiService.listAnalysis();
      setAnalysis(data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar análises: ' + err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysisComplete = async (analysisResult) => {
    try {
      // Após análise, salvar no backend
      const saved = await apiService.createAnalysis(analysisResult);
      
      // Atualizar lista
      setAnalysis([saved, ...(analysis || [])]);
      setError('');
    } catch (err) {
      setError('Erro ao salvar análise: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header com informações do usuário */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Análise de Ideias de Negócio
          </h1>
          <p className="text-gray-600">
            Usuário autenticado: <strong>{user?.email}</strong>
          </p>
        </div>

        {/* Mensagens de erro */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={() => setError('')}
              className="text-xs text-red-600 underline mt-2"
            >
              Descartar
            </button>
          </div>
        )}

        {/* Componente de Dashboard - Pass dados se necessário */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Carregando análises...</p>
          </div>
        ) : (
          <AnalysisDashboard 
            onAnalysisComplete={handleAnalysisComplete}
            initialData={analysis}
          />
        )}
      </div>
    </div>
  );
};

export default AnalysisDashboardPage;
