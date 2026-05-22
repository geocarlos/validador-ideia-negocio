const prompt = require('./prompt');
const { tecnicoResponseSchema } = require('./schema');
const { callOpenAI } = require('../../services/openai.service');

async function agent(ideaText) {
  const result = await callOpenAI({
    systemPrompt: prompt,
    userMessage: `Ideia: ${ideaText}`,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    responseSchema: tecnicoResponseSchema,
    temperature: 0.3,
    maxTokens: 700,
    agentName: 'tecnico'
  });

  return result.data;
}

module.exports = { agent };
