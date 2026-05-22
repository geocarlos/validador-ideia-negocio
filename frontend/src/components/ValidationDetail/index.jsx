/**
 * ValidationDetail - Página de detalhe de uma validação específica
 * 
 * Responsabilidades:
 * - Exibir todos os detalhes de uma validação por ID
 * - Usar AnalysisDashboard para exibir agentes
 * - Gerenciar estados: loading, error, data
 * - Navegação com BackButton
 * - Layout limpo e organizado
 * 
 * @param {Object} props
 * @param {string} props.id - ID da validação a exibir
 * @returns {JSX.Element}
 */

import React from 'react';
import useValidationDetail from '../../hooks/useValidationDetail';
import AnalysisDashboard from '../AnalysisDashboard';
import BackButton from './BackButton';

const ValidationDetail = ({ id }) => {
  const { data, loading, error } = useValidationDetail(id);

  // Estado de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <BackButton fallbackPath="/dashboard" />

          <div className="mt-8 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">
                Carregando validação...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <BackButton fallbackPath="/dashboard" />

          <div className="mt-8">
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-red-600">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900">
                    Erro ao carregar validação
                  </h3>
                  <p className="mt-1 text-sm text-red-700">
                    {error.message ||
                      'Ocorreu um erro ao tentar carregar a validação. Tente novamente.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado vazio
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <BackButton fallbackPath="/dashboard" />

          <div className="mt-8">
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-3 text-sm font-medium text-gray-900">
                Validação não encontrada
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                A validação que você procura não existe ou foi removida.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Extrair dados para exibição organizada
  const {
    id: validationId,
    idea,
    ideia,
    createdAt,
    summary,
    technicalAnalysis,
    marketAnalysis,
    financialAnalysis,
    metricas,
  } = data;

  const ideaText = ideia || idea;

  // Normalizar dados de data
  const formatDate = (dateString) => {
    if (!dateString) return 'Data desconhecida';
    try {
      return new Date(dateString).toLocaleString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const analysisData = {
    technicalAnalysis,
    marketAnalysis,
    financialAnalysis,
    summary,
    metrics: metricas,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header com volta */}
        <div className="mb-8">
          <BackButton fallbackPath="/dashboard" />
        </div>

        {/* Card de informações gerais */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                Detalhe da Validação
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                ID: <span className="font-mono text-gray-700">{validationId}</span>
              </p>
            </div>

          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Criada em
              </p>
              <p className="mt-1 text-sm text-gray-700">
                {formatDate(createdAt)}
              </p>
            </div>
            {metricas?.tempo_execucao_ms != null && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Tempo de execução
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  {metricas.tempo_execucao_ms}ms
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Seção de Ideia Original */}
        {ideaText && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ideia de Negócio
            </h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap break-words">
                {typeof ideaText === 'string'
                  ? ideaText
                  : JSON.stringify(ideaText, null, 2)}
              </p>
            </div>
          </div>
        )}

        {/* Dashboard de Análise - Reutiliza componente existente */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <AnalysisDashboard
            result={analysisData}
            isLoading={false}
            error={null}
          />
        </div>

        {/* Footer com ação de retorno */}
        <div className="mt-8 flex justify-center">
          <BackButton fallbackPath="/dashboard" />
        </div>
      </div>
    </div>
  );
};

export default ValidationDetail;
