const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/prisma/client');

describe('Validation Routing Tests', () => {
  const testEmail = 'validator-tester@validador.com';
  let token;
  let userId;
  let createdValidationId;

  beforeAll(async () => {
    // Registra e gera o token de autenticação
    const authRes = await request(app)
      .post('/auth/login')
      .send({ email: testEmail });

    token = authRes.body.token;
    userId = authRes.body.userId;
  });

  afterAll(async () => {
    // Limpa registros do banco de dados gerados nos testes
    try {
      await prisma.user.delete({ where: { email: testEmail } });
    } catch (e) {
      // Ignora erro se o usuário já foi apagado ou não existia
    }
    await prisma.$disconnect();
  });

  it('deve retornar 401 ao tentar chamar rota protegida sem token', async () => {
    const res = await request(app)
      .post('/api/validar')
      .send({ ideia: 'Uma ideia de negócio super legal com mais de 20 caracteres.' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Unauthorized');
  });

  it('deve retornar 400 ao submeter ideia com menos de 20 caracteres', async () => {
    const res = await request(app)
      .post('/api/validar')
      .set('Authorization', `Bearer ${token}`)
      .send({ ideia: 'Ideia curta' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Validation error');
    expect(res.body.details).toContain('must be at least 20 characters');
  });

  it('deve criar uma nova validação com sucesso e retornar o consolidado mockado', async () => {
    const res = await request(app)
      .post('/api/validar')
      .set('Authorization', `Bearer ${token}`)
      .send({ ideia: 'Um aplicativo inovador de caronas corporativas exclusivas para empresas de tecnologia.' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('consolidado');
    expect(res.body).toHaveProperty('metricas');
    expect(res.body.consolidado).toHaveProperty('mercado');
    expect(res.body.consolidado).toHaveProperty('tecnico');
    expect(res.body.consolidado).toHaveProperty('financeiro');
    expect(res.body.metricas).toHaveProperty('agentes_sucesso', 3);

    createdValidationId = res.body.id;
  });

  it('deve listar o histórico de validações do usuário com paginação', async () => {
    const res = await request(app)
      .get('/api/validacoes')
      .set('Authorization', `Bearer ${token}`)
      .query({ page: 1, pageSize: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('total');
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.items[0].id).toBe(createdValidationId);
  });

  it('deve filtrar o histórico de validações por termo de busca', async () => {
    // Busca por termo presente
    const resWithMatch = await request(app)
      .get('/api/validacoes')
      .set('Authorization', `Bearer ${token}`)
      .query({ search: 'caronas' });

    expect(resWithMatch.statusCode).toBe(200);
    expect(resWithMatch.body.items.length).toBeGreaterThan(0);

    // Busca por termo inexistente
    const resNoMatch = await request(app)
      .get('/api/validacoes')
      .set('Authorization', `Bearer ${token}`)
      .query({ search: 'termo_inexistente_de_teste' });

    expect(resNoMatch.statusCode).toBe(200);
    expect(resNoMatch.body.items.length).toBe(0);
  });

  it('deve recuperar os detalhes de uma validação específica', async () => {
    const res = await request(app)
      .get(`/api/validacoes/${createdValidationId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdValidationId);
    expect(res.body).toHaveProperty('consolidado');
    expect(res.body).toHaveProperty('metricas');
  });

  it('deve excluir uma validação do histórico com sucesso', async () => {
    const res = await request(app)
      .delete(`/api/validacoes/${createdValidationId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);

    // Verifica que não pode mais ser encontrada
    const checkRes = await request(app)
      .get(`/api/validacoes/${createdValidationId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(checkRes.statusCode).toBe(404);
  });
});
