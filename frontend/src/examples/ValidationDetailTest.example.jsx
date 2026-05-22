/**
 * Exemplo de teste: ValidationDetail com dados mock
 * 
 * Mostra como testar o componente sem fazer requisição à API
 * Útil para desenvolvimento e testes manuais
 */

import ValidationDetail from '../components/ValidationDetail';

/**
 * Mock de dados completos de uma validação
 * Estrutura esperada do endpoint GET /api/validacoes/:id
 */
const MOCK_VALIDATION_DATA = {
  id: '507f1f77bcf86cd799439011',
  idea: `Criar uma plataforma SaaS de análise de dados em tempo real para PMEs, 
usando IA para gerar insights automáticos. A plataforma teria:
- Dashboard intuitivo com métricas personalizáveis
- Integração com CRM e ferramentas de marketing
- Alertas automáticos baseados em IA
- Relatórios customizáveis em PDF

O público-alvo são micro e pequenas empresas (10-100 funcionários) que precisam 
de análise de dados mas não têm equipe de BI. O modelo de negócio seria subscription 
mensal (R$ 500-2000 dependendo de features).

Já validei com 15 empresas que têm dor e pagariam por isso. Tenho network para 
vender e experiência em SaaS (3 anos em startup anterior).`,

  createdAt: '2026-05-21T14:30:00Z',
  updatedAt: '2026-05-21T14:35:00Z',

  score: 8.5,

  summary: `Ideia com potencial elevado. Mercado validado, diferenciação clara, 
mas competição aumentando. Viabilidade técnica depende de qualidade da IA.`,

  recommendation: `Recomendado prosseguir com MVP focado em 1-2 métricas críticas. 
Validar disposição de pagamento com clientes-alvo. Considerar partnership com 
ferramenta de CRM para acelerar adoção.`,

  technicalAnalysis: {
    complexity: 'Alto',
    timeline: '6-8 meses para MVP',
    stack: ['Node.js', 'React', 'PostgreSQL', 'OpenAI API'],
    challenges: [
      'Integração com múltiplos CRMs',
      'Qualidade de insights de IA',
      'Performance em grandes volumes de dados',
    ],
    recommendations: [
      'Começar com 1 integração (Salesforce ou Pipedrive)',
      'Usar fine-tuned model de IA específico para dados de vendas',
      'Implementar cache de resultados',
    ],
  },

  marketAnalysis: {
    marketSize: 'R$ 2.5B (Brasil), R$ 50B (LATAM)',
    targetSegment: 'PMEs em setores de vendas e marketing',
    competitorCount: 3,
    competitors: [
      'Metabase (genérico, sem IA)',
      'Supermetrics (focused em marketing)',
      'Insights nativos do Salesforce',
    ],
    differentiation: 'IA simplificada para PMEs sem BI team',
    adoptionBarriers: [
      'Educação sobre valor de BI',
      'Integração com sistemas legados',
      'Customização para cada vertical',
    ],
  },

  financialAnalysis: {
    revenueModel: 'Subscription mensal + add-ons',
    unitEconomics: {
      acq: 'R$ 2000-5000 por cliente',
      arr: 'R$ 6000 (média)',
      churn: '5% ao mês estimado',
      ltv: 'R$ 120k',
    },
    fundingNeeded: 'R$ 300k para 18 meses de MVP + sales',
    breakeven: '24 meses com 50+ clientes pagantes',
    risks: [
      'Dependency em OpenAI API (custo variável)',
      'Churn elevado se insights baixa qualidade',
      'Sales-heavy (requer SDR)',
    ],
  },

  result: {
    technicalAnalysis: {
      complexity: 'Alto',
      timeline: '6-8 meses para MVP',
      stack: ['Node.js', 'React', 'PostgreSQL', 'OpenAI API'],
      challenges: [
        'Integração com múltiplos CRMs',
        'Qualidade de insights de IA',
        'Performance em grandes volumes de dados',
      ],
      recommendations: [
        'Começar com 1 integração (Salesforce ou Pipedrive)',
        'Usar fine-tuned model de IA específico para dados de vendas',
        'Implementar cache de resultados',
      ],
    },
    marketAnalysis: {
      marketSize: 'R$ 2.5B (Brasil), R$ 50B (LATAM)',
      targetSegment: 'PMEs em setores de vendas e marketing',
      competitorCount: 3,
      competitors: [
        'Metabase (genérico, sem IA)',
        'Supermetrics (focused em marketing)',
        'Insights nativos do Salesforce',
      ],
      differentiation: 'IA simplificada para PMEs sem BI team',
      adoptionBarriers: [
        'Educação sobre valor de BI',
        'Integração com sistemas legados',
        'Customização para cada vertical',
      ],
    },
    financialAnalysis: {
      revenueModel: 'Subscription mensal + add-ons',
      unitEconomics: {
        acq: 'R$ 2000-5000 por cliente',
        arr: 'R$ 6000 (média)',
        churn: '5% ao mês estimado',
        ltv: 'R$ 120k',
      },
      fundingNeeded: 'R$ 300k para 18 meses de MVP + sales',
      breakeven: '24 meses com 50+ clientes pagantes',
      risks: [
        'Dependency em OpenAI API (custo variável)',
        'Churn elevado se insights baixa qualidade',
        'Sales-heavy (requer SDR)',
      ],
    },
  },
};

/**
 * Componente de teste - Simula ValidationDetail sem fazer requisição
 * Use para desenvolvimento local ou testes manuais
 */
export default function ValidationDetailTest() {
  return (
    <div>
      <ValidationDetail id="507f1f77bcf86cd799439011" />
    </div>
  );
}

/**
 * Para usar este exemplo em desenvolvimento:
 * 
 * 1. Importar em App.jsx:
 *    import ValidationDetailTest from './examples/ValidationDetailTest.example';
 * 
 * 2. Adicionar rota de teste:
 *    <Route path="/test/validation-detail" element={<ValidationDetailTest />} />
 * 
 * 3. Navegar para http://localhost:5173/test/validation-detail
 * 
 * 4. O componente fará requisição a GET /api/validacoes/507f1f77bcf86cd799439011
 *    Configure o backend para retornar dados mock ou use mock handler (MSW)
 */

/**
 * Alternativa com Mock Handler (MSW - Mock Service Worker)
 * 
 * Se usar MSW para mock da API:
 * 
 * // handlers.js
 * import { rest } from 'msw';
 * 
 * export const handlers = [
 *   rest.get('/api/validacoes/:id', (req, res, ctx) => {
 *     return res(ctx.json(MOCK_VALIDATION_DATA));
 *   }),
 * ];
 * 
 * // main.jsx
 * import { setupServer } from 'msw/node';
 * import { handlers } from './mocks/handlers';
 * 
 * if (process.env.NODE_ENV === 'development') {
 *   const server = setupServer(...handlers);
 *   server.listen();
 * }
 */

export { MOCK_VALIDATION_DATA };
