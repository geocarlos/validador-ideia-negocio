async function agent(ideaText) {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    problema: `Dificuldade de validação rápida e de baixo custo enfrentada por fundadores de startups e empreendedores na fase inicial da ideia: "${ideaText.substring(0, 60)}..."`,
    publico_alvo: {
      primario: "Fundadores de startups em estágio inicial (Pre-seed e Bootstrapped)",
      secundario: "Desenvolvedores indie, consultores de negócios e incubadoras"
    },
    tam: "Mercado global em expansão com milhões de novos negócios registrados anualmente; estimativa qualitativa alta para soluções de IA aplicadas a negócios.",
    concorrentes: [
      "Consultorias de negócios tradicionais",
      "Modelos genéricos de IA (ChatGPT, Claude) sem especialização",
      "Plataformas SaaS de validação manuais (pesquisas de mercado tradicionais)"
    ],
    diferencial: "Análise instantânea e especializada e paralela em três dimensões cruciais (mercado, técnico, financeiro) com baixo custo operacional."
  };
}

module.exports = { agent };
