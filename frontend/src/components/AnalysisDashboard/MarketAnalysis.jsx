/**
 * MarketAnalysis - Card para exibir análise de mercado
 * 
 * @param {Object} props
 * @param {Object|string} props.data - Dados da análise de mercado
 * @param {boolean} [props.isLoading] - Estado de carregamento
 */
const MarketAnalysis = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <div className="flex items-center space-x-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-300 border-t-green-600"></div>
          <p className="text-sm text-green-600">Analisando mercado...</p>
        </div>
      </div>
    );
  }

  const isEmpty = !data || (typeof data === 'string' && !data.trim()) || (typeof data === 'object' && Object.keys(data).length === 0);

  if (isEmpty) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h3 className="mb-2 font-semibold text-gray-700">Análise de Mercado</h3>
        <p className="text-sm text-gray-500">Nenhuma análise de mercado disponível</p>
      </div>
    );
  }

  const isObject = typeof data === 'object';

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-6 shadow-sm">
      <div className="mb-4 flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-200">
          <span className="text-sm font-bold text-green-700">📊</span>
        </div>
        <h3 className="text-lg font-semibold text-green-900">Análise de Mercado</h3>
      </div>

      <div className="space-y-3">
        {isObject ? (
          Object.entries(data).map(([key, value]) => (
            <div key={key} className="rounded-md bg-white p-3">
              <p className="text-xs font-semibold uppercase text-green-700">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                {String(value) || 'Sem informações'}
              </p>
            </div>
          ))
        ) : (
          <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
            {data}
          </p>
        )}
      </div>
    </div>
  );
};

export default MarketAnalysis;
