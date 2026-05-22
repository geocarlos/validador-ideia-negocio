import { describe, it, expect, beforeEach, vi } from 'vitest';
import validationService from './validationService';
import { API_URL } from './apiConfig';
import { installLocalStorageMock, createFakeJwt } from '../test/helpers';

describe('validationService', () => {
  beforeEach(() => {
    installLocalStorageMock();
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
  });

  describe('validateIdea', () => {
    const ideaText = 'Uma plataforma de assinatura para produtores locais';
    const apiResponse = {
      id: 'val-99',
      ideia: ideaText,
      consolidado: { tecnico: { mvp_estimativa: '2 meses' } },
      metricas: { agentes_sucesso: 3, agentes_erro: 0 },
    };

    function mockOkFetch() {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(apiResponse),
      });
    }

    it('envia POST para /validar com body ideia e headers corretos', async () => {
      const token = createFakeJwt({
        userId: 'user-1',
        email: 'dev@example.com',
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      localStorage.setItem('auth_token', token);
      mockOkFetch();

      await validationService.validateIdea(ideaText);

      expect(fetch).toHaveBeenCalledTimes(1);
      const [url, options] = fetch.mock.calls[0];

      expect(url).toBe(`${API_URL}/validar`);
      expect(options.method).toBe('POST');
      expect(options.headers).toMatchObject({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
      expect(JSON.parse(options.body)).toEqual({ ideia: ideaText });
    });

    it('mapeia a resposta de sucesso para o formato da UI', async () => {
      mockOkFetch();

      const result = await validationService.validateIdea(ideaText);

      expect(result.idea).toBe(ideaText);
      expect(result.technicalAnalysis).toEqual(apiResponse.consolidado.tecnico);
    });

    it('propaga erro quando fetch falha', async () => {
      fetch.mockRejectedValueOnce(new Error('Network down'));

      await expect(validationService.validateIdea(ideaText)).rejects.toThrow(
        'Network down',
      );
    });

    it('trata resposta não-ok com mensagem da API', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Validation failed',
          details: 'ideia must be at least 20 characters',
        }),
      });

      await expect(validationService.validateIdea('curta')).rejects.toThrow(
        'ideia must be at least 20 characters',
      );
    });
  });
});
