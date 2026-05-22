/**
 * Serviço de API genérico — delega aos endpoints reais do backend.
 */

import { apiRequest } from './apiClient';
import authService from './authService';
import validationService from './validationService';
import { mapValidationResponse } from '../utils/validationMapper';

const apiService = {
  async request(endpoint, options = {}) {
    return apiRequest(endpoint, options);
  },

  async getValidation(id) {
    return validationService.getValidationDetail(id);
  },

  async listValidations(filters = {}) {
    const { page = 1, pageSize = 10, search, query } = filters;
    return validationService.fetchHistory({
      page,
      pageSize,
      query: search || query || '',
    });
  },

  async createValidation(ideia) {
    const idea = ideia?.ideia ?? ideia?.idea ?? ideia;
    return validationService.validateIdea(idea);
  },

  async deleteValidation(id) {
    return validationService.deleteValidation(id);
  },

  /** @deprecated use getValidation */
  async getAnalysis(id) {
    return this.getValidation(id);
  },

  /** @deprecated use listValidations */
  async listAnalysis(filters = {}) {
    return this.listValidations(filters);
  },

  /** @deprecated use createValidation */
  async createAnalysis(data) {
    return this.createValidation(data);
  },

  /** @deprecated use deleteValidation */
  async deleteAnalysis(id) {
    return this.deleteValidation(id);
  },

  async updateAnalysis() {
    throw new Error('Atualização de validação não suportada pelo backend');
  },

  async getUserProfile() {
    const user = authService.getUserFromToken();
    if (!user) throw new Error('Usuário não autenticado');
    return user;
  },
};

export { mapValidationResponse };
export default apiService;
