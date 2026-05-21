/**
 * Serviço específico de validação de ideias.
 * Desacopla a chamada ao endpoint /api/validar.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const validationService = {
  async validateIdea(idea) {
    const response = await fetch(`${API_URL}/validar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idea }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message || `Erro na validação: ${response.status}`);
    }

    return response.json();
  },
  /**
   * Busca histórico de validações com paginação e filtros.
   * params: { page, pageSize, query, from, to }
   */
  async fetchHistory({ page = 1, pageSize = 10, query = '', from, to, signal } = {}) {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    if (query) params.set('q', query);
    if (from) params.set('from', from);
    if (to) params.set('to', to);

    const url = `${API_URL}/validacoes?${params.toString()}`;

    const response = await fetch(url, { signal });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message || `Erro ao buscar histórico: ${response.status}`);
    }

    return response.json();
  },
};

export default validationService;
