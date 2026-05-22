/**
 * Utilitários compartilhados para testes do frontend.
 */

export function createLocalStorageMock() {
  let store = {};

  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
}

export function installLocalStorageMock() {
  const mock = createLocalStorageMock();
  Object.defineProperty(window, 'localStorage', {
    value: mock,
    writable: true,
  });
  return mock;
}

export function createFakeJwt(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.mock-signature`;
}

export const apiErrorFixtures = {
  validationError: {
    error: 'Validation failed',
    details: 'ideia must be at least 20 characters',
  },
  authError: {
    error: 'Unauthorized',
    details: 'Token is invalid or expired',
  },
  genericError: {
    error: 'Erro interno do servidor',
  },
  messageOnly: {
    message: 'Falha na requisição',
  },
};
