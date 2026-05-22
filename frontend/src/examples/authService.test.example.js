/**
 * Testes de exemplo para authService
 * Use Jest + Testing Library
 */

import authService from '../services/authService';

// Mock do localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock do fetch
global.fetch = jest.fn();

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: '123',
          email: 'test@example.com',
        },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await authService.login('test@example.com');

      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
    });

    it('deve lançar erro em caso de falha', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Email inválido' }),
      });

      await expect(authService.login('invalid@example.com')).rejects.toThrow(
        'Email inválido'
      );
    });
  });

  describe('logout', () => {
    it('deve remover token do localStorage', () => {
      localStorage.setItem('auth_token', 'mock-token');
      authService.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('getToken', () => {
    it('deve retornar token do localStorage', () => {
      localStorage.setItem('auth_token', 'mock-token');
      expect(authService.getToken()).toBe('mock-token');
    });

    it('deve retornar null se não houver token', () => {
      expect(authService.getToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('deve retornar true se autenticado', () => {
      localStorage.setItem('auth_token', 'mock-token');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('deve retornar false se não autenticado', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('getUserFromToken', () => {
    it('deve decodificar dados do token JWT', () => {
      // JWT: header.payload.signature
      // Payload: {"id":"123","email":"test@example.com"}
      const mockToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJpZCI6IjEyMyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSJ9.' +
        'mock-signature';

      localStorage.setItem('auth_token', mockToken);
      const user = authService.getUserFromToken();

      expect(user).toEqual({
        id: '123',
        email: 'test@example.com',
      });
    });

    it('deve retornar null se não houver token', () => {
      expect(authService.getUserFromToken()).toBeNull();
    });
  });

  describe('getAuthHeaders', () => {
    it('deve incluir Authorization header com token', () => {
      localStorage.setItem('auth_token', 'mock-token');
      const headers = authService.getAuthHeaders();

      expect(headers['Authorization']).toBe('Bearer mock-token');
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('deve retornar apenas Content-Type se não autenticado', () => {
      const headers = authService.getAuthHeaders();

      expect(headers['Content-Type']).toBe('application/json');
      expect(headers['Authorization']).toBeUndefined();
    });
  });
});
