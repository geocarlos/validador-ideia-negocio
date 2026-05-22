const prompt = require('./prompt');
const { mercadoResponseSchema } = require('./schema');
const { callOpenAI } = require('../../services/openai.service');

async function agent(ideaText) {
  const result = await callOpenAI({
    systemPrompt: prompt,
    userMessage: `Ideia: ${ideaText}`,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    responseSchema: mercadoResponseSchema,
    temperature: 0.3,
    maxTokens: 700,
    agentName: 'mercado'
  });

  return result.data;
}

module.exports = { agent };
