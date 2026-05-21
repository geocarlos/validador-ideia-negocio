/**
 * Validadores para dados de análise
 * 
 * Funções para validação de dados antes de exibir no dashboard
 */

/**
 * Verifica se campo de análise está vazio
 */
export const isFieldEmpty = (field) => {
  if (!field) return true;
  if (typeof field === 'string') return field.trim().length === 0;
  if (typeof field === 'object') return Object.keys(field).length === 0;
  return false;
};

/**
 * Valida se resultado tem dados suficientes para exibição
 */
export const hasEnoughData = (result) => {
  if (!result) return false;

  const { technicalAnalysis, marketAnalysis, financialAnalysis, summary } = result;

  const validFields = [
    !isFieldEmpty(technicalAnalysis),
    !isFieldEmpty(marketAnalysis),
    !isFieldEmpty(financialAnalysis),
    !isFieldEmpty(summary),
  ].filter(Boolean);

  return validFields.length >= 2; // Requer pelo menos 2 análises
};

/**
 * Valida score
 */
export const isValidScore = (score) => {
  if (!score) return false;
  const num = typeof score === 'string' ? parseFloat(score) : score;
  return typeof num === 'number' && num >= 0 && num <= 10;
};

/**
 * Monitora dados faltantes em resultado de análise
 */
export const getMissingFields = (result) => {
  const missing = [];

  if (isFieldEmpty(result?.technicalAnalysis)) {
    missing.push('technicalAnalysis');
  }
  if (isFieldEmpty(result?.marketAnalysis)) {
    missing.push('marketAnalysis');
  }
  if (isFieldEmpty(result?.financialAnalysis)) {
    missing.push('financialAnalysis');
  }
  if (isFieldEmpty(result?.summary)) {
    missing.push('summary');
  }

  return missing;
};
