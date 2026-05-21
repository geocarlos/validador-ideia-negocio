/**
 * Componente de barra de navegação com logout
 * Exemplo de como usar useAuth para exibir informações do usuário
 */

import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="font-bold text-xl text-blue-600">
          🚀 Validador Avançado
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500">
                  ID: {user.id}
                </p>
              </div>

              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {user.email.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md
              hover:bg-red-600 transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
