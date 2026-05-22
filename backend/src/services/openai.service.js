const OpenAI = require('openai');

const {
  OpenAIConfigError,
  OpenAIParseError,
  OpenAIServiceError,
  OpenAITimeoutError,
  OpenAIValidationError
} = require('../errors/openai.errors');

const TRANSIENT_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

let openAIClient;
let sleepFn = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getTimeoutMs() {
  const configured = Number(process.env.OPENAI_TIMEOUT_MS);
  return Number.isFinite(configured) && configured > 0 ? configured : 30000;
}

function getMaxRetries() {
  const configured = Number(process.env.OPENAI_MAX_RETRIES);
  return Number.isFinite(configured) && configured >= 0 ? configured : 3;
}

function getStatusCode(error) {
  return error?.status || error?.statusCode || error?.response?.status || null;
}

function isAbortError(error) {
  return error?.name === 'AbortError' || error?.code === 'ABORT_ERR';
}

function createClient() {
  if (openAIClient) {
    return openAIClient;
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new OpenAIConfigError('OPENAI_API_KEY is required to call OpenAI APIs.');
  }

  openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openAIClient;
}

function parseJsonContent(rawContent, agentName) {
  const trimmed = String(rawContent || '').trim();

  if (!trimmed) {
    throw new OpenAIParseError('OpenAI returned empty content, cannot parse JSON.', {
      agentName,
      rawContent
    });
  }

  try {
    return JSON.parse(trimmed);
  } catch (_error) {
    // Continue with resilient extraction strategies.
  }

  const fencedMatch = trimmed.match(/```json\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    try {
      return JSON.parse(fencedMatch[1].trim());
    } catch (_error) {
      // Continue to broad object extraction.
    }
  }

  const objectMatch = trimmed.match(/\{[\s\S]*\}/);
  if (objectMatch?.[0]) {
    try {
      return JSON.parse(objectMatch[0].trim());
    } catch (_error) {
      // Fall through to parse error.
    }
  }

  throw new OpenAIParseError('Failed to parse JSON from OpenAI response content.', {
    agentName,
    rawContent
  });
}

function validateResponse(parsed, responseSchema, agentName) {
  const validation = responseSchema.safeParse(parsed);

  if (!validation.success) {
    throw new OpenAIValidationError('OpenAI response failed schema validation.', {
      agentName,
      details: validation.error.flatten()
    });
  }

  return validation.data;
}

function shouldRetry(error) {
  if (error instanceof OpenAITimeoutError) {
    return true;
  }

  const statusCode = getStatusCode(error);
  return TRANSIENT_STATUS_CODES.has(statusCode);
}

function toTypedError(error, agentName, timeoutMs) {
  if (
    error instanceof OpenAITimeoutError ||
    error instanceof OpenAIParseError ||
    error instanceof OpenAIValidationError ||
    error instanceof OpenAIConfigError ||
    error instanceof OpenAIServiceError
  ) {
    return error;
  }

  if (isAbortError(error)) {
    return new OpenAITimeoutError(
      `OpenAI request timed out after ${timeoutMs}ms for agent ${agentName}.`,
      { agentName, cause: error }
    );
  }

  const statusCode = getStatusCode(error);
  return new OpenAIServiceError(
    `OpenAI request failed for agent ${agentName}${statusCode ? ` with status ${statusCode}` : ''}.`,
    {
      agentName,
      statusCode,
      cause: error,
      details: error?.message || null
    }
  );
}

/**
 * @template T
 * @param {{
 *  systemPrompt: string,
 *  userMessage: string,
 *  model: string,
 *  responseSchema: import('zod').ZodType<T>,
 *  temperature?: number,
 *  maxTokens?: number,
 *  agentName: string
 * }} params
 * @returns {Promise<{
 *  data: T,
 *  usage: { promptTokens: number, completionTokens: number, totalTokens: number },
 *  attemptCount: number,
 *  latencyMs: number
 * }>}
 */
async function callOpenAI(params) {
  const {
    systemPrompt,
    userMessage,
    model,
    responseSchema,
    temperature = 0.3,
    maxTokens = 700,
    agentName
  } = params;

  const timeoutMs = getTimeoutMs();
  const maxAttempts = getMaxRetries() + 1;
  const startedAt = Date.now();

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const client = createClient();

      const completion = await client.chat.completions.create(
        {
          model,
          temperature,
          max_tokens: maxTokens,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ]
        },
        { signal: controller.signal }
      );

      clearTimeout(timeoutHandle);

      const rawContent = completion?.choices?.[0]?.message?.content;
      const parsed = parseJsonContent(rawContent, agentName);
      const data = validateResponse(parsed, responseSchema, agentName);
      const usage = {
        promptTokens: completion?.usage?.prompt_tokens || 0,
        completionTokens: completion?.usage?.completion_tokens || 0,
        totalTokens: completion?.usage?.total_tokens || 0
      };

      const successLog = {
        agentName,
        model,
        attemptCount: attempt,
        latencyMs: Date.now() - startedAt,
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        success: true,
        error: null
      };
      console.log(JSON.stringify(successLog));

      return {
        data,
        usage,
        attemptCount: attempt,
        latencyMs: Date.now() - startedAt
      };
    } catch (error) {
      clearTimeout(timeoutHandle);

      const typedError = toTypedError(error, agentName, timeoutMs);
      const retryable = shouldRetry(typedError);

      if (retryable && attempt < maxAttempts) {
        const delayMs = (2 ** attempt) * 1000 + Math.floor(Math.random() * 501);

        console.warn(
          JSON.stringify({
            event: 'openai_retry',
            agentName,
            model,
            attempt,
            maxAttempts,
            delayMs,
            error: typedError.message,
            statusCode: typedError.statusCode || null
          })
        );

        await sleepFn(delayMs);
        continue;
      }

      console.error(
        JSON.stringify({
          agentName,
          model,
          attemptCount: attempt,
          latencyMs: Date.now() - startedAt,
          promptTokens: 0,
          completionTokens: 0,
          success: false,
          error: typedError.message
        })
      );

      throw typedError;
    }
  }

  throw new OpenAIServiceError('OpenAI call failed unexpectedly after retries.', {
    agentName: params.agentName
  });
}

function __setOpenAIClientForTests(client) {
  openAIClient = client;
}

function __resetOpenAIClientForTests() {
  openAIClient = undefined;
}

function __setSleepForTests(customSleepFn) {
  sleepFn = customSleepFn;
}

module.exports = {
  callOpenAI,
  __setOpenAIClientForTests,
  __resetOpenAIClientForTests,
  __setSleepForTests
};
