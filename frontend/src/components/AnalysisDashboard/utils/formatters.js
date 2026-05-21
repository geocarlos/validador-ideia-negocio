/**
 * Formatadores para dados de análise
 * 
 * Funções utilitárias para formatar e transformar dados de análise
 */

/**
 * Formata texto com quebras de linha preservadas
 */
export const formatAnalysisText = (text) => {
  if (!text) return '';
  return String(text).trim();
};

/**
 * Extrai score numérico de uma string
 * Exemplo: "7/10" → 7, "8.5/10" → 8.5
 */
export const extractScore = (scoreString) => {
  if (!scoreString) return null;
  const match = String(scoreString).match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : null;
};

/**
 * Converte objeto em formato legível
 * { key: value } → "Key: value"
 */
export const formatObject = (obj) => {
  if (typeof obj === 'string') return obj;
  if (typeof obj !== 'object' || obj === null) return '';

  return Object.entries(obj)
    .map(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
      const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
      return `${capitalizedKey}: ${value}`;
    })
    .join('\n');
};

/**
 * Valida estrutura de resultado de análise
 */
export const isValidAnalysisResult = (result) => {
  if (!result || typeof result !== 'object') return false;

  const required = ['summary', 'technicalAnalysis', 'marketAnalysis', 'financialAnalysis'];
  return required.every(field => field in result);
};

/**
 * Normaliza dados de análise para formato consistente
 */
export const normalizeAnalysisResult = (raw) => {
  return {
    summary: formatAnalysisText(raw?.summary),
    technicalAnalysis: raw?.technicalAnalysis || {},
    marketAnalysis: raw?.marketAnalysis || {},
    financialAnalysis: raw?.financialAnalysis || {},
    score: raw?.score ? extractScore(raw.score) : null,
    recommendation: formatAnalysisText(raw?.recommendation),
  };
};
