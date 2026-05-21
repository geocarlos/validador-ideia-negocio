const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');


async function loginOuCadastrar(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    const error = new Error("Email is required and must be valid");
    error.statusCode = 400;
    throw error;
  }

  const emailNormalizado = email.toLowerCase().trim();

  let user = await prisma.user.findUnique({
    where: { email: emailNormalizado }
  });

  if (!user) {
    user = await prisma.user.create({
      data: { email: emailNormalizado }
    });
  }

  const expiresIn = 604800; // 7 dias em segundos
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn }
  );

  return {
    token,
    expiresIn,
    userId: user.id
  };
}

module.exports = {
  loginOuCadastrar
};
