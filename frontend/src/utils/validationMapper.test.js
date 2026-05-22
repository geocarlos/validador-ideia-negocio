import { describe, it, expect } from 'vitest';
import { mapValidationResponse } from './validationMapper';

describe('mapValidationResponse', () => {
  const fullPayload = {
    id: 'val-1',
    ideia: 'Plataforma de assinatura para produtores locais',
    createdAt: '2026-05-22T10:00:00.000Z',
    consolidado: {
      tecnico: { mvp_estimativa: '3 meses', stack: ['Node', 'React'] },
      mercado: { problema: 'Baixa visibilidade de produtores' },
      financeiro: { proximo_passo: 'Validar precificação' },
    },
    metricas: {
      agentes_sucesso: 3,
      agentes_erro: 0,
      tempo_execucao_ms: 1200,
    },
  };

  it('transforma o campo ideia da API em idea', () => {
    const mapped = mapValidationResponse(fullPayload);

    expect(mapped.ideia).toBe(fullPayload.ideia);
    expect(mapped.idea).toBe(fullPayload.ideia);
  });

  it('transforma consolidado.tecnico em technicalAnalysis', () => {
    const mapped = mapValidationResponse(fullPayload);

    expect(mapped.technicalAnalysis).toEqual(fullPayload.consolidado.tecnico);
  });

  it('preserva os demais dados e análises correlatas', () => {
    const mapped = mapValidationResponse(fullPayload);

    expect(mapped).toMatchObject({
      id: fullPayload.id,
      createdAt: fullPayload.createdAt,
      consolidado: fullPayload.consolidado,
      metricas: fullPayload.metricas,
      metrics: fullPayload.metricas,
      marketAnalysis: fullPayload.consolidado.mercado,
      financialAnalysis: fullPayload.consolidado.financeiro,
    });
    expect(mapped.summary).toContain('Mercado: Baixa visibilidade de produtores');
    expect(mapped.summary).toContain('MVP estimado: 3 meses');
  });

  it('retorna null quando o payload é null ou undefined', () => {
    expect(mapValidationResponse(null)).toBeNull();
    expect(mapValidationResponse(undefined)).toBeNull();
  });

  it('trata payload vazio com valores padrão seguros', () => {
    const mapped = mapValidationResponse({});

    expect(mapped).toEqual({
      id: undefined,
      ideia: undefined,
      idea: undefined,
      createdAt: undefined,
      consolidado: {},
      metricas: {},
      metrics: {},
      technicalAnalysis: null,
      marketAnalysis: null,
      financialAnalysis: null,
      summary: null,
    });
  });

  it('trata consolidado e metricas ausentes ou nulos', () => {
    const mapped = mapValidationResponse({
      id: 'val-2',
      ideia: 'Ideia mínima válida para teste',
      consolidado: null,
      metricas: null,
    });

    expect(mapped.consolidado).toEqual({});
    expect(mapped.metricas).toEqual({});
    expect(mapped.technicalAnalysis).toBeNull();
    expect(mapped.marketAnalysis).toBeNull();
    expect(mapped.financialAnalysis).toBeNull();
    expect(mapped.summary).toBeNull();
  });

  it('define technicalAnalysis como null quando tecnico está ausente', () => {
    const mapped = mapValidationResponse({
      ideia: 'Ideia sem bloco técnico',
      consolidado: { mercado: { problema: 'Apenas mercado' } },
    });

    expect(mapped.technicalAnalysis).toBeNull();
    expect(mapped.marketAnalysis).toEqual({ problema: 'Apenas mercado' });
  });
});
