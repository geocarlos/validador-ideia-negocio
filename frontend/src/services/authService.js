/**
 * Serviço de autenticação
 * Gerencia login, token e comunicação com API
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const authService = {
  /**
   * Fazer login
   * @param {string} email - Email do usuário
   * @returns {Promise<{token: string, user: {id: string, email: string}}>}
   */
  async login(email) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao fazer login');
      }

      const data = await response.json();

      // Persistir token no localStorage
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Fazer logout
   */
  logout() {
    localStorage.removeItem('auth_token');
  },

  /**
   * Obter token armazenado
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('auth_token');
  },

  /**
   * Verificar se está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Obter dados do usuário do token (básico - sem validação)
   * Em produção, use uma rota de validação no backend
   * @returns {object|null}
   */
  getUserFromToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      // JWT tem 3 partes: header.payload.signature
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  },

  /**
   * Validar token com o backend
   * @returns {Promise<boolean>}
   */
  async validateToken() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },

  /**
   * Obter headers com autenticação
   * @returns {object}
   */
  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  },
};

export default authService;
