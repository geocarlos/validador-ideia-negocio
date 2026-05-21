/**
 * Exemplo de composição do AnalysisDashboard
 * 
 * Demonstra como integrar o dashboard em uma aplicação real
 * com gerenciamento de estado e chamadas à API
 */

import { useState, useEffect } from 'react';
import AnalysisDashboard from '../AnalysisDashboard';
import IdeaForm from '../IdeaForm/IdeaForm';
import { validateIdea } from '../../services/validationService';

export const AnalysisDashboardPage = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userIdea, setUserIdea] = useState('');

  const handleIdeaSubmit = async (ideaData) => {
    setIsLoading(true);
    setError(null);
    setUserIdea(ideaData.title);

    try {
      const result = await validateIdea(ideaData);
      
      // Normaliza resultado da API
      const normalizedResult = {
        summary: result.summary || '',
        technicalAnalysis: result.technicalAnalysis || {},
        marketAnalysis: result.marketAnalysis || {},
        financialAnalysis: result.financialAnalysis || {},
        score: result.score || null,
        recommendation: result.recommendation || null,
      };
      
      setAnalysisResult(normalizedResult);
    } catch (err) {
      setError({
        message: err.message || 'Erro ao processar análise',
        type: 'validation_error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
    setUserIdea('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Validador de Ideias de Negócio
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Análise instantânea com inteligência artificial multiagente
          </p>
        </div>

        {/* Duas colunas: Formulário e Resultado */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Coluna esquerda: Formulário */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                {analysisResult ? 'Nova Análise' : 'Descreva sua Ideia'}
              </h2>
              
              <IdeaForm 
                onSubmit={handleIdeaSubmit}
                isLoading={isLoading}
                onReset={analysisResult ? handleReset : null}
              />
            </div>
          </div>

          {/* Coluna direita: Dashboard */}
          <div className="lg:col-span-2">
            {userIdea && (
              <div className="mb-4 rounded-lg bg-blue-50 p-3 border border-blue-200">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Análise de:</span> {userIdea}
                </p>
              </div>
            )}
            
            <AnalysisDashboard
              result={analysisResult}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>

        {/* Sugestões de UX */}
        {analysisResult && !isLoading && (
          <div className="mt-12 grid gap-4 rounded-lg bg-white p-6 shadow-sm md:grid-cols-3">
            <div>
              <h4 className="font-semibold text-gray-900">💡 Próximos Passos</h4>
              <p className="mt-2 text-sm text-gray-600">
                Considere refinar sua ideia com base nos insights fornecidos e revalidar
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">📊 Compare Ideias</h4>
              <p className="mt-2 text-sm text-gray-600">
                Analise múltiplas variações da sua ideia para encontrar a melhor abordagem
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">🔄 Histórico</h4>
              <p className="mt-2 text-sm text-gray-600">
                Visualize todas as suas análises anteriores no histórico
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisDashboardPage;
