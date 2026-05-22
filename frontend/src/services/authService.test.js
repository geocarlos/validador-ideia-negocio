import { describe, it, expect, beforeEach, vi } from 'vitest';
import authService from './authService';
import { createFakeJwt, installLocalStorageMock } from '../test/helpers';

describe('authService', () => {
  beforeEach(() => {
    installLocalStorageMock();
    localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('getUserFromToken', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;

    it('extrai userId e email corretamente de um JWT fake', () => {
      const token = createFakeJwt({
        userId: 'user-42',
        email: 'test@example.com',
        exp: futureExp,
      });
      localStorage.setItem('auth_token', token);

      expect(authService.getUserFromToken()).toEqual({
        id: 'user-42',
        email: 'test@example.com',
      });
    });

    it('aceita id como fallback de userId no payload', () => {
      const token = createFakeJwt({
        id: 'legacy-id',
        email: 'legacy@example.com',
        exp: futureExp,
      });
      localStorage.setItem('auth_token', token);

      expect(authService.getUserFromToken()).toEqual({
        id: 'legacy-id',
        email: 'legacy@example.com',
      });
    });

    it('retorna null para token inválido', () => {
      localStorage.setItem('auth_token', 'token-invalido');

      expect(authService.getUserFromToken()).toBeNull();
    });

    it('retorna null quando não há token', () => {
      expect(authService.getUserFromToken()).toBeNull();
    });

    it('retorna null para token offline', () => {
      localStorage.setItem('auth_token', 'sessao.offline');

      expect(authService.getUserFromToken()).toBeNull();
    });

    it('retorna null para token expirado', () => {
      const token = createFakeJwt({
        userId: 'user-expired',
        email: 'expired@example.com',
        exp: Math.floor(Date.now() / 1000) - 10,
      });
      localStorage.setItem('auth_token', token);

      expect(authService.getUserFromToken()).toBeNull();
    });

    it('não quebra com payload incompleto', () => {
      const token = createFakeJwt({ exp: futureExp });
      localStorage.setItem('auth_token', token);

      expect(authService.getUserFromToken()).toEqual({
        id: undefined,
        email: undefined,
      });
    });
  });
});
