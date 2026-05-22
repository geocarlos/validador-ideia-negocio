/**
 * Serviço de autenticação — login JWT e sessão local.
 */

import { API_URL, parseApiError } from './apiConfig';

const authService = {
  async login(email) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(parseApiError(payload, 'Erro ao fazer login'));
    }

    const data = await response.json();

    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }

    const normalizedEmail = email.toLowerCase().trim();

    return {
      token: data.token,
      expiresIn: data.expiresIn,
      userId: data.userId,
      user: {
        id: data.userId,
        email: normalizedEmail,
      },
    };
  },

  logout() {
    localStorage.removeItem('auth_token');
  },

  getToken() {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  getUserFromToken() {
    const token = this.getToken();
    if (!token || token.endsWith('.offline')) {
      return null;
    }

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return null;
      }

      return {
        id: decoded.userId || decoded.id,
        email: decoded.email,
      };
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  },

  async validateToken() {
    const token = this.getToken();
    if (!token) return false;

    const user = this.getUserFromToken();
    return !!user;
  },

  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },
};

export default authService;
