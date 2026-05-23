const request = require('supertest');
const app = require('../src/app');

describe('App.js Tests', () => {
  it('deve retornar 404 para uma rota inexistente', async () => {
    const res = await request(app).get('/rota-que-nao-existe-123456');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Route Not Found');
  });

  it('deve retornar 400 para JSON inválido (SyntaxError)', async () => {
    const res = await request(app)
      .post('/api/validar')
      .set('Content-Type', 'application/json')
      .send('{"ideia": "teste inválido sem fechar aspas }');
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid JSON');
    expect(res.body).toHaveProperty('details');
  });
});
