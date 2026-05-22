/**
 * Cliente HTTP centralizado — base URL, auth, erros e 401.
 */

import authService from './authService';
import { API_URL, parseApiError } from './apiConfig';

export { API_URL, parseApiError };

export async function apiRequest(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...authService.getAuthHeaders(),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    authService.logout();
    if (
      typeof window !== 'undefined' &&
      !window.location.pathname.startsWith('/login')
    ) {
      window.location.href = '/login';
    }
    throw new Error('Sessão expirada');
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(parseApiError(payload, `Erro: ${response.status}`));
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
