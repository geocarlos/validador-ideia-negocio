const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const validationService = require('../services/validationService');

router.use(authMiddleware);

router.post('/validar', async (req, res, next) => {
  const { ideia } = req.body;

  try {
    const result = await validationService.validarIdeia(req.user.id, ideia);
    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        error: "Validation error",
        details: error.message
      });
    }
    next(error);
  }
});

router.get('/validacoes', async (req, res, next) => {
  const { page, pageSize, search } = req.query;

  try {
    const result = await validationService.listarHistorico(req.user.id, { page, pageSize, search });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/validacoes/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await validationService.obterPorId(req.user.id, id);
    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        error: "Not Found",
        details: error.message
      });
    }
    next(error);
  }
});

router.delete('/validacoes/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await validationService.deletarValidacao(req.user.id, id);
    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        error: "Not Found",
        details: error.message
      });
    }
    next(error);
  }
});

module.exports = router;
