/**
 * Exemplo de configuração de rotas com autenticação
 * Integre este código no seu App.jsx ou arquivo principal de rotas
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthGuard from './components/auth/AuthGuard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            }
          />

          {/* Análise também é protegida */}
          <Route
            path="/analysis/:id"
            element={
              <AuthGuard>
                <AnalysisPage />
              </AuthGuard>
            }
          />

          {/* Redirecionar raiz para dashboard se autenticado */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
