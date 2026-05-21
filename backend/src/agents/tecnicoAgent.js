async function agent(ideaText) {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    complexidade: "média",
    stack_sugerida: [
      "Next.js (Frontend)",
      "Node.js + Express (Backend)",
      "Prisma ORM",
      "PostgreSQL/SQLite",
      "TailwindCSS"
    ],
    componente_ia: "Integração via API com LLM (OpenAI gpt-4o-mini) por meio de prompts especializados e orquestração paralela.",
    limitacoes_tecnicas: [
      "Dependência de latência de APIs externas de inteligência artificial",
      "Necessidade de sanitização rigorosa de inputs dos usuários para evitar injeção de prompt",
      "Garantia de consistência das saídas JSON do modelo"
    ],
    mvp_estimativa: "4-6 semanas"
  };
}

module.exports = { agent };
