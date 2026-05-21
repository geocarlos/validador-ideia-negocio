async function agent(ideaText) {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    modelo_receita: "subscription",
    custo_operacional_ia: "Custo baixo a médio (aproximadamente $0.02 por validação utilizando gpt-4o-mini).",
    viabilidade_financeira: "média",
    proximo_passo: "Criar uma Landing Page com formulário de e-mail e botão de compra falso para medir a taxa de conversão e intenção de pagamento."
  };
}

module.exports = { agent };
