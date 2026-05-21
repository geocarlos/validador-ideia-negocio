const { orquestrarValidacao } = require('../../src/orchestrator/validacaoOrchestrator');
const tecnicoAgent = require('../../src/agents/tecnicoAgent');

describe('Orchestrator Unit Tests', () => {
  const testIdea = 'Plataforma B2B para rastreamento de cargas utilizando blockchain.';

  it('deve executar com sucesso todos os agentes em paralelo e consolidar as métricas', async () => {
    const result = await orquestrarValidacao(testIdea);
    
    expect(result).toHaveProperty('consolidado');
    expect(result).toHaveProperty('metricas');
    expect(result.consolidado).toHaveProperty('mercado');
    expect(result.consolidado).toHaveProperty('tecnico');
    expect(result.consolidado).toHaveProperty('financeiro');
    
    // Testa as métricas consolidáveis
    expect(result.metricas).toHaveProperty('tempo_execucao_ms');
    expect(result.metricas).toHaveProperty('tokens_estimados');
    expect(result.metricas.agentes_sucesso).toBe(3);
    expect(result.metricas.agentes_erro).toBe(0);
  });

  it('deve tolerar falha parcial de um agente e retornar dados dos demais com status de erro na chave afetada', async () => {
    // Espiona o tecnicoAgent e força um erro temporário
    const spy = jest.spyOn(tecnicoAgent, 'agent').mockRejectedValueOnce(new Error('Serviço Técnico temporariamente indisponível'));

    const result = await orquestrarValidacao(testIdea);

    expect(result).toHaveProperty('consolidado');
    expect(result.consolidado).toHaveProperty('mercado');
    expect(result.consolidado).toHaveProperty('tecnico');
    expect(result.consolidado).toHaveProperty('financeiro');

    // Valida se o erro do agente técnico foi capturado no consolidado
    expect(result.consolidado.tecnico).toHaveProperty('erro', 'Error');
    expect(result.consolidado.tecnico.mensagem).toContain('indisponível');

    // Valida se os outros agentes executaram com sucesso
    expect(result.consolidado.mercado).not.toHaveProperty('erro');
    expect(result.consolidado.financeiro).not.toHaveProperty('erro');

    // Valida as métricas de falha parcial
    expect(result.metricas.agentes_sucesso).toBe(2);
    expect(result.metricas.agentes_erro).toBe(1);

    // Restaura o mock
    spy.mockRestore();
  });
});
