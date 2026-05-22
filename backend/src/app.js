const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('../swagger');
const routes = require('./routes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(routes);

app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found" });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: "Invalid JSON",
      details: "Corpo da requisição JSON está inválido. Verifique aspas, vírgulas e quebras de linha em strings."
    });
  }

  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    details: err.message
  });
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
