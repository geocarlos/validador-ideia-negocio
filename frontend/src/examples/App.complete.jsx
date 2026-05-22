/**
 * Exemplo Completo de App.jsx com Autenticação
 * Copie e adapte este código para seu projeto
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Páginas
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AnalysisDetailPage from './pages/AnalysisDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Componentes de Proteção
import AuthGuard from './components/auth/AuthGuard';

/**
 * Componente raiz da aplicação
 * Estrutura completa com autenticação
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ==================== ROTAS PÚBLICAS ==================== */}

          {/* Página de Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* ==================== ROTAS PROTEGIDAS ==================== */}

          {/* Dashboard Principal */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            }
          />

          {/* Detalhes de Análise */}
          <Route
            path="/analysis/:id"
            element={
              <AuthGuard>
                <AnalysisDetailPage />
              </AuthGuard>
            }
          />

          {/* ==================== REDIRECIONAMENTOS ==================== */}

          {/* Raiz redireciona para dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 - Deve ser a última rota */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
