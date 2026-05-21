const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

router.post('/login', async (req, res, next) => {
  const { email } = req.body;

  try {
    const payload = await authService.loginOuCadastrar(email);
    return res.status(200).json(payload);
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

module.exports = router;
