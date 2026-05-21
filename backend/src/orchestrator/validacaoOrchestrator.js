const mercadoAgent = require('../agents/mercadoAgent');
const tecnicoAgent = require('../agents/tecnicoAgent');
const financeiroAgent = require('../agents/financeiroAgent');

async function orquestrarValidacao(ideia) {
  const startTime = Date.now();

  const executarAgente = async (nome, agentFn) => {
    try {
      const resultado = await agentFn(ideia);
      return { nome, sucesso: true, resultado };
    } catch (error) {
      console.error(`Erro no agente [${nome}]:`, error);
      return {
        nome,
        sucesso: false,
        resultado: {
          erro: error.name || "Agent Error",
          mensagem: error.message || "Erro inesperado ao processar o agente."
        }
      };
    }
  };

  const promessas = [
    executarAgente('mercado', mercadoAgent.agent),
    executarAgente('tecnico', tecnicoAgent.agent),
    executarAgente('financeiro', financeiroAgent.agent)
  ];

  const resultados = await Promise.all(promessas);

  const consolidado = {};
  let agentesSucesso = 0;
  let agentesErro = 0;

  resultados.forEach(({ nome, sucesso, resultado }) => {
    consolidado[nome] = resultado;
    if (sucesso) {
      agentesSucesso++;
    } else {
      agentesErro++;
    }
  });

  const tempoExecucaoMs = Date.now() - startTime;
  const tokensEstimados = agentesSucesso * 800; 

  return {
    consolidado,
    metricas: {
      tempo_execucao_ms: tempoExecucaoMs,
      tokens_estimados: tokensEstimados,
      agentes_sucesso: agentesSucesso,
      agentes_erro: agentesErro
    }
  };
}

module.exports = { orquestrarValidacao };
