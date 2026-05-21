const express = require('express');
const router = express.Router();

const prisma = require('../prisma/client');
const authRouter = require('./auth');
const validarRouter = require('./validar');

router.use('/auth', authRouter);
router.use('/api/auth', authRouter); 

router.use('/api', validarRouter);

router.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      status: "UP",
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      status: "DOWN",
      database: "error",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
