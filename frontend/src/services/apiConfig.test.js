import { describe, it, expect } from 'vitest';
import { parseApiError } from './apiConfig';
import { apiErrorFixtures } from '../test/helpers';

describe('parseApiError', () => {
  const fallback = 'Erro desconhecido';

  it('prioriza details quando presente na resposta da API', () => {
    const message = parseApiError(
      apiErrorFixtures.validationError,
      fallback,
    );

    expect(message).toBe(apiErrorFixtures.validationError.details);
  });

  it('usa error quando details não existe', () => {
    const message = parseApiError(apiErrorFixtures.genericError, fallback);

    expect(message).toBe(apiErrorFixtures.genericError.error);
  });

  it('usa message quando details e error não existem', () => {
    const message = parseApiError(apiErrorFixtures.messageOnly, fallback);

    expect(message).toBe(apiErrorFixtures.messageOnly.message);
  });

  it('retorna fallback quando o payload não traz mensagem utilizável', () => {
    expect(parseApiError({}, fallback)).toBe(fallback);
    expect(parseApiError(null, fallback)).toBe(fallback);
    expect(parseApiError(undefined, fallback)).toBe(fallback);
  });

  it('não quebra com payloads inesperados', () => {
    expect(parseApiError('erro em string', fallback)).toBe(fallback);
    expect(parseApiError(42, fallback)).toBe(fallback);
    expect(() => parseApiError({ details: 'ok' }, fallback)).not.toThrow();
  });

  it('reflete formato real de erro de autenticação do backend', () => {
    const message = parseApiError(apiErrorFixtures.authError, fallback);

    expect(message).toBe('Token is invalid or expired');
  });
});
