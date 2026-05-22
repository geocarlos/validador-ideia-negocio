/**
 * Serviço de validação — alinhado com a API do backend.
 */

import { apiRequest } from './apiClient';
import {
  mapValidationResponse,
  mapHistoryResponse,
} from '../utils/validationMapper';

const validationService = {
  async validateIdea(idea) {
    const data = await apiRequest('/validar', {
      method: 'POST',
      body: JSON.stringify({ ideia: idea }),
    });
    return mapValidationResponse(data);
  },

  async fetchHistory({ page = 1, pageSize = 10, query = '', signal } = {}) {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    if (query) params.set('search', query);

    const data = await apiRequest(`/validacoes?${params.toString()}`, { signal });
    return mapHistoryResponse(data);
  },

  async getValidationDetail(id) {
    if (!id) {
      throw new Error('ID da validação é obrigatório');
    }
    const data = await apiRequest(`/validacoes/${id}`);
    return mapValidationResponse(data);
  },

  async deleteValidation(id) {
    if (!id) {
      throw new Error('ID da validação é obrigatório');
    }
    const data = await apiRequest(`/validacoes/${id}`, { method: 'DELETE' });
    return data ?? { success: true };
  },
};

export default validationService;
