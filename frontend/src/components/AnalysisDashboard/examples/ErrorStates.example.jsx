/**
 * Exemplo com erro
 */

import AnalysisDashboard from '../index';

export const DashboardErrorExample = () => {
  const mockError = {
    message: 'Falha ao processar análise. Tente novamente.',
    type: 'validation_error'
  };

  return (
    <div className="bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard - Error State</h1>
          <p className="mt-2 text-gray-600">Exemplo de tratamento de erro</p>
        </div>

        <AnalysisDashboard 
          result={null}
          isLoading={false}
          error={mockError}
        />
      </div>
    </div>
  );
};

export default DashboardErrorExample;
