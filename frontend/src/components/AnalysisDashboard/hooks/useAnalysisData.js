/**
 * useAnalysisData - Hook para validar e normalizar dados de análise
 * 
 * Garante que os dados estejam sempre em um formato consistente
 * e trata casos de dados ausentes ou malformados
 */
export const useAnalysisData = (analysisResult) => {
  const normalizeData = (data) => {
    if (!data) return null;
    if (typeof data === 'string') return data;
    if (typeof data === 'object') return data;
    return String(data);
  };

  const isDataEmpty = (data) => {
    if (!data) return true;
    if (typeof data === 'string') return data.trim().length === 0;
    if (typeof data === 'object') return Object.keys(data).length === 0;
    return false;
  };

  const hasValidAnalysis = () => {
    if (!analysisResult) return false;
    
    const { technicalAnalysis, marketAnalysis, financialAnalysis, summary } = analysisResult;
    
    return (
      !isDataEmpty(technicalAnalysis) ||
      !isDataEmpty(marketAnalysis) ||
      !isDataEmpty(financialAnalysis) ||
      !isDataEmpty(summary)
    );
  };

  return {
    technicalAnalysis: normalizeData(analysisResult?.technicalAnalysis),
    marketAnalysis: normalizeData(analysisResult?.marketAnalysis),
    financialAnalysis: normalizeData(analysisResult?.financialAnalysis),
    summary: normalizeData(analysisResult?.summary),
    score: analysisResult?.score || null,
    recommendation: analysisResult?.recommendation || null,
    hasValidAnalysis: hasValidAnalysis(),
  };
};
