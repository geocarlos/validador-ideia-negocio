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
};

export default validationService;
