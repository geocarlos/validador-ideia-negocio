/**
 * SummaryCard - Exibe o resumo geral da análise
 * 
 * @param {Object} props
 * @param {string} props.summary - Texto do resumo
 * @param {string} [props.score] - Score geral (opcional)
 * @param {string} [props.recommendation] - Recomendação (opcional)
 */
const SummaryCard = ({ summary, score, recommendation }) => {
  const isEmpty = !summary && !score && !recommendation;

  if (isEmpty) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <p className="text-center text-sm text-gray-500">
          Nenhum resumo disponível
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-3 text-lg font-semibold text-blue-900">Resumo Executivo</h3>
          
          <p className="mb-4 whitespace-pre-line text-sm text-blue-800 leading-relaxed">
            {summary || 'Análise em progresso...'}
          </p>

          {recommendation && (
            <div className="mt-4 rounded-md bg-blue-100 p-3">
              <p className="text-xs font-semibold text-blue-700 uppercase">Recomendação</p>
              <p className="mt-1 text-sm text-blue-900">{recommendation}</p>
            </div>
          )}
        </div>

        {score && (
          <div className="ml-4 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white p-2 shadow-md">
            <span className="text-xs font-semibold text-gray-600">Score</span>
            <span className="text-3xl font-bold text-blue-600">{score}</span>
            <span className="text-xs text-gray-500">/10</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
