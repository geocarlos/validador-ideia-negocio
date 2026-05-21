const mercadoAgent = require('../../src/agents/mercadoAgent');
const tecnicoAgent = require('../../src/agents/tecnicoAgent');
const financeiroAgent = require('../../src/agents/financeiroAgent');

describe('Agents Unit Tests (Mock)', () => {
  const testIdea = 'Uma plataforma de delivery especializada em comida vegana caseira para empresas.';

  it('Mercado Agent deve retornar a estrutura de mercado correta', async () => {
    expect(typeof mercadoAgent.agent).toBe('function');
    
    const result = await mercadoAgent.agent(testIdea);
    expect(result).toHaveProperty('problema');
    expect(result).toHaveProperty('publico_alvo');
    expect(result.publico_alvo).toHaveProperty('primario');
    expect(result.publico_alvo).toHaveProperty('secundario');
    expect(result).toHaveProperty('tam');
    expect(result).toHaveProperty('concorrentes');
    expect(Array.isArray(result.concorrentes)).toBe(true);
    expect(result).toHaveProperty('diferencial');
  });

  it('Técnico Agent deve retornar a estrutura técnica correta', async () => {
    expect(typeof tecnicoAgent.agent).toBe('function');

    const result = await tecnicoAgent.agent(testIdea);
    expect(result).toHaveProperty('complexidade');
    expect(result).toHaveProperty('stack_sugerida');
    expect(Array.isArray(result.stack_sugerida)).toBe(true);
    expect(result).toHaveProperty('componente_ia');
    expect(result).toHaveProperty('limitacoes_tecnicas');
    expect(Array.isArray(result.limitacoes_tecnicas)).toBe(true);
    expect(result).toHaveProperty('mvp_estimativa');
  });

  it('Financeiro Agent deve retornar a estrutura financeira correta', async () => {
    expect(typeof financeiroAgent.agent).toBe('function');

    const result = await financeiroAgent.agent(testIdea);
    expect(result).toHaveProperty('modelo_receita');
    expect(result).toHaveProperty('custo_operacional_ia');
    expect(result).toHaveProperty('viabilidade_financeira');
    expect(result).toHaveProperty('proximo_passo');
  });
});
