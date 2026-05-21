/**
 * CompleteIntegration.jsx - Exemplo completo de integração
 * 
 * Demonstra como integrar todos os componentes:
 * - IdeaForm para submissão
 * - AnalysisDashboard para exibição
 * - Histórico de análises
 * - Navegação entre estados
 */

import { useState } from 'react';
import AnalysisDashboard from '../components/AnalysisDashboard';
import IdeaForm from '../components/IdeaForm/IdeaForm';
import { validateIdea } from '../services/validationService';

export const CompleteIntegration = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIdea, setCurrentIdea] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleIdeaSubmit = async (ideaData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Chamada à API
      const result = await validateIdea(ideaData);

      // Estrutura resultado
      const analysis = {
        id: Date.now(),
        idea: ideaData,
        result: {
          summary: result.summary || '',
          technicalAnalysis: result.technicalAnalysis || {},
          marketAnalysis: result.marketAnalysis || {},
          financialAnalysis: result.financialAnalysis || {},
          score: result.score,
          recommendation: result.recommendation,
        },
        timestamp: new Date().toISOString(),
      };

      // Atualiza estado
      setAnalysisResult(analysis.result);
      setCurrentIdea(ideaData.title);
      setHistory([analysis, ...history]);
      setShowHistory(false);
    } catch (err) {
      setError({
        message: err.message || 'Erro ao processar análise',
        type: 'validation_error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadFromHistory = (item) => {
    setAnalysisResult(item.result);
    setCurrentIdea(item.idea.title);
    setShowHistory(false);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setCurrentIdea(null);
    setError(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Validador de Ideias
            </h1>
            <p className="text-sm text-gray-600">
              Análise multi-agente com IA
            </p>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
          >
            📋 Histórico ({history.length})
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb */}
          {currentIdea && (
            <div className="mb-8 flex items-center space-x-2">
              <span className="text-sm text-gray-500">Análise de:</span>
              <span className="font-semibold text-gray-900">{currentIdea}</span>
              <button
                onClick={handleReset}
                className="ml-2 text-xs text-blue-600 hover:text-blue-700 underline"
              >
                ← Nova análise
              </button>
            </div>
          )}

          {/* Layout em 2 colunas */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Coluna esquerda: Formulário ou Histórico */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="rounded-lg bg-white p-6 shadow-lg">
                  <h2 className="mb-6 text-xl font-semibold text-gray-900">
                    {analysisResult ? '➕ Nova Análise' : '✏️ Descreva sua Ideia'}
                  </h2>
                  <IdeaForm
                    onSubmit={handleIdeaSubmit}
                    isLoading={isLoading}
                    onReset={analysisResult ? handleReset : null}
                  />
                </div>

                {/* Histórico em expandido */}
                {showHistory && history.length > 0 && (
                  <div className="mt-4 rounded-lg bg-white shadow-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Histórico</h3>
                    <div className="space-y-2">
                      {history.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleLoadFromHistory(item)}
                          className="w-full text-left rounded-lg hover:bg-gray-50 p-2 border border-gray-200 transition"
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {item.idea.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Coluna direita: Dashboard */}
            <div className="lg:col-span-2">
              <AnalysisDashboard
                result={analysisResult}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>

          {/* Sugestões quando análise completa */}
          {analysisResult && !isLoading && (
            <div className="mt-12">
              <div className="rounded-lg bg-white p-8 shadow-sm">
                <h3 className="mb-6 text-lg font-semibold text-gray-900">
                  Sugestões de Próximos Passos
                </h3>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="font-semibold text-blue-900">💡 Refine sua Ideia</p>
                    <p className="mt-2 text-sm text-blue-700">
                      Incorpore os insights fornecidos e revalide sua ideia para melhorar os scores
                    </p>
                  </div>

                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                    <p className="font-semibold text-purple-900">🔄 Compare Ideias</p>
                    <p className="mt-2 text-sm text-purple-700">
                      Analise múltiplas variações para encontrar a abordagem mais viável
                    </p>
                  </div>

                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="font-semibold text-green-900">📊 Histórico</p>
                    <p className="mt-2 text-sm text-green-700">
                      Compare análises anteriores para acompanhar evolução da sua ideia
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            © 2024 Validador de Ideias de Negócio. Powered by AI Multiagent.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CompleteIntegration;
