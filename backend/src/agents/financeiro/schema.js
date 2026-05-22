const { z } = require('zod');

const normalizeLabel = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const financeiroResponseSchema = z.object({
  modelo_receita: z.string().min(1),
  custo_operacional_ia: z.string().min(1),
  viabilidade_financeira: z
    .string()
    .transform((value) => normalizeLabel(value))
    .refine((value) => ['baixa', 'media', 'alta'].includes(value), {
      message: 'viabilidade_financeira must be baixa, media or alta'
    }),
  proximo_passo: z.string().min(1)
});

module.exports = { financeiroResponseSchema };
