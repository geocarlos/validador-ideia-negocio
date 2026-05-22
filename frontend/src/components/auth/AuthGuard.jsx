/**
 * Protetor de rotas (AuthGuard)
 * Redireciona usuários não autenticados para login
 */

import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * Componente que protege rotas privadas
 * @param {ReactNode} children - Componente a ser renderizado se autenticado
 * @param {string} redirectTo - Caminho para redirecionar se não autenticado (padrão: '/login')
 * @param {ReactNode} fallback - Componente a renderizar enquanto carrega (padrão: spinner)
 */
const AuthGuard = ({ children, redirectTo = '/login', fallback = null }) => {
  const { isAuthenticated, loading } = useAuth();

  // Enquanto carrega, mostrar fallback ou spinner
  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin text-2xl">⏳</div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não autenticado, redirecionar
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Se autenticado, renderizar componente
  return children;
};

export default AuthGuard;
