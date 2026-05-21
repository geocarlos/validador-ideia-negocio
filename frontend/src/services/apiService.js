/**
 * Exemplo de Serviço de API
 * Mostra como usar authService em requisições autenticadas
 */

import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiService = {
  /**
   * Fazer requisição autenticada genérica
   */
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = authService.getAuthHeaders();

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      // Se token expirou (401), fazer logout
      if (response.status === 401) {
        authService.logout();
        window.location.href = '/login';
        throw new Error('Sessão expirada');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },

  /**
   * GET - Obter análise por ID
   */
  async getAnalysis(id) {
    return this.request(`/analysis/${id}`);
  },

  /**
   * GET - Listar todas as análises do usuário
   */
  async listAnalysis(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/analysis?${params}`);
  },

  /**
   * POST - Criar nova análise
   */
  async createAnalysis(data) {
    return this.request('/analysis', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT - Atualizar análise
   */
  async updateAnalysis(id, data) {
    return this.request(`/analysis/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE - Deletar análise
   */
  async deleteAnalysis(id) {
    return this.request(`/analysis/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Exemplo: Obter perfil do usuário
   */
  async getUserProfile() {
    return this.request('/user/profile');
  },
};

export default apiService;
