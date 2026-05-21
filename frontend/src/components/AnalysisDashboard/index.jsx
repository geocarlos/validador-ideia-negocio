/**
 * AnalysisDashboard - Dashboard principal para exibir análise multi-agente
 * 
 * Componente responsável por:
 * - Exibir resultado estruturado da análise
 * - Gerenciar estado de carregamento
 * - Tratamento de dados ausentes
 * - Layout responsivo
 * 
 * @param {Object} props
 * @param {Object} [props.result] - Resultado da análise com structure:
 *        { technicalAnalysis, marketAnalysis, financialAnalysis, summary, score?, recommendation? }
 * @param {boolean} [props.isLoading] - Estado de carregamento
 * @param {Object} [props.error] - Objeto de erro
 */

import SummaryCard from './SummaryCard';
import TechnicalAnalysis from './TechnicalAnalysis';
import MarketAnalysis from './MarketAnalysis';
import FinancialAnalysis from './FinancialAnalysis';
import { useAnalysisData } from './hooks/useAnalysisData';

const AnalysisDashboard = ({ result, isLoading = false, error = null }) => {
  const analysisData = useAnalysisData(result);

  // Estado de erro
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 text-red-600">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-red-900">Erro na análise</h3>
            <p className="mt-1 text-sm text-red-700">
              {error.message || 'Ocorreu um erro ao processar a análise. Tente novamente.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Estado vazio inicial
  if (!isLoading && !analysisData.hasValidAnalysis) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="mt-3 text-sm font-medium text-gray-900">Nenhuma análise disponível</h3>
        <p className="mt-1 text-sm text-gray-500">
          Envie uma ideia de negócio para começar a análise
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {!isLoading && analysisData.hasValidAnalysis && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Análise da Sua Ideia</h2>
          <p className="mt-1 text-gray-600">Resultado da análise multi-agente</p>
        </div>
      )}

      {/* Resumo Executivo - Em destaque no topo */}
      <div className="lg:col-span-2">
        <SummaryCard
          summary={analysisData.summary}
          score={analysisData.score}
          recommendation={analysisData.recommendation}
        />
      </div>

      {/* Grid responsivo para as análises especializadas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TechnicalAnalysis 
          data={analysisData.technicalAnalysis} 
          isLoading={isLoading}
        />
        
        <MarketAnalysis 
          data={analysisData.marketAnalysis} 
          isLoading={isLoading}
        />
        
        <FinancialAnalysis 
          data={analysisData.financialAnalysis} 
          isLoading={isLoading}
        />
      </div>

      {/* Loading State - Mais elegante */}
      {isLoading && (
        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            </div>
            <p className="text-sm text-gray-600 font-medium">Analisando sua ideia...</p>
            <p className="text-xs text-gray-500">Aguarde enquanto os agentes especialistas processam a análise</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDashboard;
