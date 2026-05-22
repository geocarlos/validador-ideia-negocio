const { z } = require('zod');

const mercadoResponseSchema = z.object({
  problema: z.string().min(1),
  publico_alvo: z.object({
    primario: z.string().min(1),
    secundario: z.string().min(1)
  }),
  tam: z.string().min(1),
  concorrentes: z.array(z.string().min(1)).min(1),
  diferencial: z.string().min(1)
});

module.exports = { mercadoResponseSchema };
