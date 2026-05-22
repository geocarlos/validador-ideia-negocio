/**
 * Dashboard - Página protegida exemplo
 * Mostra como usar authService e useAuth
 */

import useAuth from '../hooks/useAuth';
import Navbar from './Navbar.example';
import AnalysisDashboard from '../components/AnalysisDashboard';

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user?.email}! 👋
          </h2>
          <p className="text-gray-600">
            Aqui você pode analisar suas ideias de negócio com IA
          </p>
        </div>

        {/* Componente de Dashboard */}
        <AnalysisDashboard />
      </div>
    </div>
  );
};

export default DashboardPage;
