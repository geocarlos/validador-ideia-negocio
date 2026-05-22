const { z } = require('zod');

const {
  OpenAIParseError,
  OpenAIServiceError,
  OpenAITimeoutError,
  OpenAIValidationError
} = require('../errors/openai.errors');

const {
  callOpenAI,
  __setOpenAIClientForTests,
  __resetOpenAIClientForTests,
  __setSleepForTests
} = require('./openai.service');

describe('openai.service', () => {
  let createMock;
  let sleepCalls;

  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.OPENAI_MODEL = 'gpt-4o-mini';
    process.env.OPENAI_TIMEOUT_MS = '30000';
    process.env.OPENAI_MAX_RETRIES = '3';

    sleepCalls = [];
    __setSleepForTests(async (ms) => {
      sleepCalls.push(ms);
    });

    createMock = jest.fn();
    __setOpenAIClientForTests({
      chat: {
        completions: {
          create: createMock
        }
      }
    });
  });

  afterEach(() => {
    __resetOpenAIClientForTests();
    jest.restoreAllMocks();
  });

  const buildParams = (overrides = {}) => ({
    systemPrompt: 'System prompt',
    userMessage: 'User message',
    model: 'gpt-4o-mini',
    responseSchema: z.object({ ok: z.boolean() }),
    agentName: 'mercado',
    ...overrides
  });

  it('returns parsed data and usage on success', async () => {
    createMock.mockResolvedValueOnce({
      choices: [{ message: { content: '{"ok":true}' } }],
      usage: { prompt_tokens: 12, completion_tokens: 5, total_tokens: 17 }
    });

    const result = await callOpenAI(buildParams());

    expect(result.data).toEqual({ ok: true });
    expect(result.usage).toEqual({
      promptTokens: 12,
      completionTokens: 5,
      totalTokens: 17
    });
    expect(result.attemptCount).toBe(1);
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('throws OpenAITimeoutError when request aborts', async () => {
    process.env.OPENAI_MAX_RETRIES = '0';
    createMock.mockRejectedValueOnce({ name: 'AbortError', message: 'aborted' });

    await expect(callOpenAI(buildParams())).rejects.toBeInstanceOf(OpenAITimeoutError);
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it('retries on 429 and succeeds on second attempt', async () => {
    createMock
      .mockRejectedValueOnce({ status: 429, message: 'rate limited' })
      .mockResolvedValueOnce({
        choices: [{ message: { content: '{"ok":true}' } }],
        usage: { prompt_tokens: 10, completion_tokens: 3, total_tokens: 13 }
      });

    const result = await callOpenAI(buildParams());

    expect(result.data).toEqual({ ok: true });
    expect(result.attemptCount).toBe(2);
    expect(createMock).toHaveBeenCalledTimes(2);
    expect(sleepCalls.length).toBe(1);
  });

  it('does not retry on 401 and throws immediately', async () => {
    createMock.mockRejectedValueOnce({ status: 401, message: 'unauthorized' });

    await expect(callOpenAI(buildParams())).rejects.toBeInstanceOf(OpenAIServiceError);
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(sleepCalls.length).toBe(0);
  });

  it('parses fenced markdown JSON content', async () => {
    createMock.mockResolvedValueOnce({
      choices: [{ message: { content: '```json\n{"ok":true}\n```' } }],
      usage: { prompt_tokens: 7, completion_tokens: 4, total_tokens: 11 }
    });

    const result = await callOpenAI(buildParams());
    expect(result.data).toEqual({ ok: true });
  });

  it('throws OpenAIParseError when content is not valid JSON', async () => {
    createMock.mockResolvedValueOnce({
      choices: [{ message: { content: 'not-json-response' } }],
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
    });

    await expect(callOpenAI(buildParams())).rejects.toBeInstanceOf(OpenAIParseError);
  });

  it('throws OpenAIValidationError for schema mismatch', async () => {
    createMock.mockResolvedValueOnce({
      choices: [{ message: { content: '{"ok":"yes"}' } }],
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
    });

    await expect(callOpenAI(buildParams())).rejects.toBeInstanceOf(OpenAIValidationError);
  });
});
