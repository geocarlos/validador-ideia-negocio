/**
 * Exibe o resultado estruturado da análise de ideia.
 */

const ValidationResults = ({ result }) => {
  if (!result) return null;

  const {
    technicalAnalysis,
    marketAnalysis,
    financialAnalysis,
    summary,
  } = result;

  return (
    <div className="mt-6 space-y-4 rounded-2xl border border-green-200 bg-green-50 p-5">
      <h3 className="text-lg font-semibold text-green-900">Resultado da validação</h3>

      <div className="space-y-3">
        <div>
          <p className="font-semibold text-gray-800">Resumo</p>
          <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{summary || 'Nenhum resumo disponível.'}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800">Análise técnica</p>
          <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{technicalAnalysis || 'Nenhuma análise técnica fornecida.'}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800">Análise de mercado</p>
          <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{marketAnalysis || 'Nenhuma análise de mercado fornecida.'}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800">Análise financeira</p>
          <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{financialAnalysis || 'Nenhuma análise financeira fornecida.'}</p>
        </div>
      </div>
    </div>
  );
};

export default ValidationResults;
