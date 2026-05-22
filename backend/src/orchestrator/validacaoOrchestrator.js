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
  const scores = {};

  resultados.forEach(({ nome, sucesso, resultado }) => {
    consolidado[nome] = resultado;
    if (sucesso) {
      agentesSucesso++;
    } else {
      agentesErro++;
    }
  });

  // Heuristic consolidation: map qualitative responses to numeric scores
  const mapViabilidade = (v) => {
    if (!v || typeof v !== 'string') return null;
    const s = v.toLowerCase();
    if (s.includes('alta')) return 0.9;
    if (s.includes('media') || s.includes('média')) return 0.6;
    if (s.includes('baixa')) return 0.2;
    return null;
  };

  const mapComplexidade = (c) => {
    // lower complexity => better score
    const m = mapViabilidade(c);
    if (m === null) return null;
    return 1 - m; // invert: baixa->0.8/0.9 becomes high score
  };

  const mapMercadoTam = (tam) => {
    if (!tam || typeof tam !== 'string') return null;
    const s = tam.toLowerCase();
    if (s.includes('grande') || s.includes('large')) return 0.9;
    if (s.includes('medio') || s.includes('médio') || s.includes('medium')) return 0.6;
    if (s.includes('pequeno') || s.includes('small')) return 0.3;
    return 0.6; // neutral default
  };

  try {
    // financeiro: viabilidade_financeira
    const fin = consolidado.financeiro;
    const t = consolidado.tecnico;
    const merc = consolidado.mercado;

    const finScore = fin ? mapViabilidade(fin.viabilidade_financeira) : null;
    const tecScore = t ? mapComplexidade(t.complexidade) : null;
    const mercScore = merc ? mapMercadoTam(merc.tam) : null;

    if (finScore !== null) scores.financeiro = finScore;
    if (tecScore !== null) scores.tecnico = tecScore;
    if (mercScore !== null) scores.mercado = mercScore;
  } catch (e) {
    // don't fail orchestration for consolidation errors
    console.error('Erro ao consolidar scores:', e.message || e);
  }

  // aggregate
  const scoreValues = Object.values(scores);
  const aggregatedScore = scoreValues.length > 0 ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length : null;
  const decision = aggregatedScore !== null ? (aggregatedScore >= 0.6 ? 'viavel' : 'nao_viavel') : 'indeterminado';

  const tempoExecucaoMs = Date.now() - startTime;
  const tokensEstimados = agentesSucesso * 800; 

  return {
    consolidado,
    consolidado_decisao: {
      scores,
      aggregatedScore,
      decision
    },
    metricas: {
      tempo_execucao_ms: tempoExecucaoMs,
      tokens_estimados: tokensEstimados,
      agentes_sucesso: agentesSucesso,
      agentes_erro: agentesErro
    }
  };
}

module.exports = { orquestrarValidacao };
