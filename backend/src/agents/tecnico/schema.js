const { z } = require('zod');

const normalizeLabel = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const tecnicoResponseSchema = z.object({
  complexidade: z
    .string()
    .transform((value) => normalizeLabel(value))
    .refine((value) => ['baixa', 'media', 'alta'].includes(value), {
      message: 'complexidade must be baixa, media or alta'
    }),
  stack_sugerida: z.array(z.string().min(1)).min(1),
  componente_ia: z.string().min(1),
  limitacoes_tecnicas: z.array(z.string().min(1)).min(1),
  mvp_estimativa: z.string().min(1)
});

module.exports = { tecnicoResponseSchema };
