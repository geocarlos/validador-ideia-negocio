const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/prisma/client');

describe('Index Routes / Health Check', () => {
  it('deve retornar 200 e status UP se o banco de dados estiver conectado', async () => {
    // Fazer mock do $queryRaw para simular sucesso
    jest.spyOn(prisma, '$queryRaw').mockResolvedValueOnce([{ 1: 1 }]);

    const res = await request(app).get('/health');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'UP');
    expect(res.body).toHaveProperty('database', 'connected');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('deve retornar 500 e status DOWN se o banco de dados falhar', async () => {
    // Fazer mock do $queryRaw para simular falha
    jest.spyOn(prisma, '$queryRaw').mockRejectedValueOnce(new Error('Erro simulado de banco de dados'));

    const res = await request(app).get('/health');
    
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('status', 'DOWN');
    expect(res.body).toHaveProperty('database', 'error');
    expect(res.body).toHaveProperty('details', 'Erro simulado de banco de dados');
    expect(res.body).toHaveProperty('timestamp');
  });
});
