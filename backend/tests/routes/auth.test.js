const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/prisma/client');

describe('Auth Routing Tests', () => {
  const testEmail = 'tester@validador.com';

  beforeAll(async () => {
    // Limpa registros antigos do tester no banco para isolar os testes
    try {
      await prisma.user.delete({ where: { email: testEmail } });
    } catch (e) {
      // Ignora erro se o usuário não existia
    }
  });

  afterAll(async () => {
    // Fecha a conexão com o banco do Prisma após rodar a suíte
    await prisma.$disconnect();
  });

  it('deve rejeitar login com e-mail vazio ou inválido', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Validation error');
  });

  it('deve realizar login com sucesso e retornar token JWT', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testEmail });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('expiresIn', 604800);

    // Valida se o usuário foi criado no banco
    const userInDb = await prisma.user.findUnique({
      where: { email: testEmail }
    });
    expect(userInDb).not.toBeNull();
    expect(userInDb.id).toBe(res.body.userId);
  });
});
