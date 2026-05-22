process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-openai-key';
process.env.OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

jest.mock('openai', () => {
  const create = jest.fn(async (payload) => {
    const systemPrompt = String(payload?.messages?.[0]?.content || '').toLowerCase();

    let content;
    if (systemPrompt.includes('market analyst')) {
      content = JSON.stringify({
        problema: 'Falta de validacao rapida de ideias',
        publico_alvo: {
          primario: 'Fundadores early-stage',
          secundario: 'Times de produto pequenos'
        },
        tam: 'Mercado em crescimento',
        concorrentes: ['Consultorias', 'Ferramentas generalistas'],
        diferencial: 'Analise multiagente em paralelo'
      });
    } else if (systemPrompt.includes('software architect')) {
      content = JSON.stringify({
        complexidade: 'media',
        stack_sugerida: ['Node.js', 'React'],
        componente_ia: 'Classificacao e geracao de insights',
        limitacoes_tecnicas: ['Latencia de API', 'Custo por token'],
        mvp_estimativa: '6-8 semanas'
      });
    } else {
      content = JSON.stringify({
        modelo_receita: 'assinatura',
        custo_operacional_ia: 'medio',
        viabilidade_financeira: 'media',
        proximo_passo: 'Executar piloto com 10 usuarios pagantes'
      });
    }

    return {
      choices: [{ message: { content } }],
      usage: {
        prompt_tokens: 120,
        completion_tokens: 80,
        total_tokens: 200
      }
    };
  });

  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create
      }
    }
  }));
});
