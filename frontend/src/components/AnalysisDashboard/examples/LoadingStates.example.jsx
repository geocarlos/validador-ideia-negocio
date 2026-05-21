/**
 * Exemplo com loading states
 */

import { useState } from 'react';
import AnalysisDashboard from '../index';

export const DashboardLoadingExample = () => {
  const [isLoading, setIsLoading] = useState(true);

  const mockResult = {
    summary: null,
    technicalAnalysis: null,
    marketAnalysis: null,
    financialAnalysis: null,
  };

  return (
    <div className="bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard - Loading State</h1>
          <button 
            onClick={() => setIsLoading(!isLoading)}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {isLoading ? 'Parar' : 'Começar'} Carregamento
          </button>
        </div>

        <AnalysisDashboard 
          result={mockResult}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default DashboardLoadingExample;
