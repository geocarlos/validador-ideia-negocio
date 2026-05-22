/**
 * Exemplo simples de uso direto do AnalysisDashboard
 */

import AnalysisDashboard from '../index';

// Mock de dados para demonstração
const mockAnalysisResult = {
  summary: 'A ideia de plataforma de marketplace para artistas é viável tecnicamente, com mercado potencial grande e modelo de receita claro. Recomenda-se validação junto a um grupo de artistas antes do full development.',
  score: 7.5,
  recommendation: 'Prosseguir com MVP focado em poucos nichos de arte',
  technicalAnalysis: {
    complexity: 'Médio - Stack padrão com alguns desafios de payment gateway e processamento de imagem',
    estimatedTimeline: '3-4 meses para MVP',
    keyTechnologies: 'React, Node.js, PostgreSQL, Stripe/PayPal',
    scalability: 'Escalável com arquitetura de microsserviços'
  },
  marketAnalysis: {
    targetAudience: 'Artistas emergentes (18-35 anos), colecionadores de arte digital',
    marketSize: 'Global, TAM estimado em $5-10B',
    competition: 'Shopify, Etsy, OpenSea - mas com foco específico em arte digital',
    differentiator: 'Foco em comunidade e curadoria de artistas'
  },
  financialAnalysis: {
    modeloReceita: 'Comissão de 10-15% por venda + taxa premium',
    custosMensais: '$2k-5k (hosting, payment gateway, moderação)',
    breakEven: '8-12 meses com 1000+ artistas ativos',
    investimentoInicial: '$50-100k para MVP'
  }
};

export const SimpleDashboardExample = () => {
  return (
    <div className="bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard - Exemplo Simples</h1>
          <p className="mt-2 text-gray-600">Visualização dos resultados de análise</p>
        </div>

        <AnalysisDashboard 
          result={mockAnalysisResult}
          isLoading={false}
        />
      </div>
    </div>
  );
};

export default SimpleDashboardExample;
