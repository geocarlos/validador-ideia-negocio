/**
 * Mapeia respostas do backend (ideia, consolidado, metricas)
 * para o formato consumido pelos componentes de UI.
 */

function buildSummary(consolidado = {}, metricas = {}) {
  const parts = [];

  if (consolidado.mercado?.problema) {
    parts.push(`Mercado: ${consolidado.mercado.problema}`);
  }

  if (consolidado.financeiro?.proximo_passo) {
    parts.push(`Próximo passo: ${consolidado.financeiro.proximo_passo}`);
  }

  if (consolidado.tecnico?.mvp_estimativa) {
    parts.push(`MVP estimado: ${consolidado.tecnico.mvp_estimativa}`);
  }

  if (metricas.agentes_sucesso !== undefined) {
    const total =
      (metricas.agentes_sucesso || 0) + (metricas.agentes_erro || 0);
    parts.push(
      `Agentes: ${metricas.agentes_sucesso} sucesso, ${metricas.agentes_erro || 0} erro (${total} total)`
    );
  }

  if (metricas.tempo_execucao_ms !== undefined) {
    parts.push(`Tempo de execução: ${metricas.tempo_execucao_ms}ms`);
  }

  return parts.length > 0 ? parts.join('\n\n') : null;
}

export function mapValidationResponse(data) {
  if (!data) return null;

  const consolidado = data.consolidado || {};
  const metricas = data.metricas || {};

  return {
    id: data.id,
    ideia: data.ideia,
    idea: data.ideia,
    createdAt: data.createdAt,
    consolidado,
    metricas,
    metrics: metricas,
    technicalAnalysis: consolidado.tecnico ?? null,
    marketAnalysis: consolidado.mercado ?? null,
    financialAnalysis: consolidado.financeiro ?? null,
    summary: buildSummary(consolidado, metricas),
  };
}

export function mapHistoryResponse(data) {
  if (!data) return { items: [], total: 0, page: 1, pageSize: 10 };

  return {
    ...data,
    items: (data.items || []).map(mapValidationResponse),
  };
}
