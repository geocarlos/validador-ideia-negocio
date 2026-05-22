/**
 * Exibe o resultado estruturado da análise de ideia.
 */

const ValidationResults = ({ result }) => {
  if (!result) return null;

  const renderAnalysis = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.join('\n');
    if (typeof value === 'object') {
      const lines = [];
      const formatKey = (k) => k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

      Object.entries(value).forEach(([k, v]) => {
        if (v === null || v === undefined) return;
        if (typeof v === 'string') {
          lines.push(`${formatKey(k)}: ${v}`);
        } else if (Array.isArray(v)) {
          lines.push(`${formatKey(k)}: ${v.join(', ')}`);
        } else if (typeof v === 'object') {
          // nested object — stringify its entries on next lines
          lines.push(`${formatKey(k)}:`);
          Object.entries(v).forEach(([nk, nv]) => {
            lines.push(`  - ${formatKey(nk)}: ${nv}`);
          });
        } else {
          lines.push(`${formatKey(k)}: ${String(v)}`);
        }
      });

      return lines.join('\n');
    }

    return String(value);
  };

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
          <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{renderAnalysis(summary) || 'Nenhum resumo disponível.'}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800">Análise técnica</p>
          <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{renderAnalysis(technicalAnalysis) || 'Nenhuma análise técnica fornecida.'}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800">Análise de mercado</p>
          <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{renderAnalysis(marketAnalysis) || 'Nenhuma análise de mercado fornecida.'}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800">Análise financeira</p>
          <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{renderAnalysis(financialAnalysis) || 'Nenhuma análise financeira fornecida.'}</p>
        </div>
      </div>
    </div>
  );
};

export default ValidationResults;
