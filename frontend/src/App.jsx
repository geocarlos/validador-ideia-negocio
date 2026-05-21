import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import useAuth from './hooks/useAuth'
import LoginForm from './components/auth/LoginForm'
import AuthGuard from './components/auth/AuthGuard'

// Página de Login Simples
const LoginPage = () => {
  const { isAuthenticated } = useAuth()
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 Validador Avançado
          </h1>
          <p className="text-gray-600">
            Análise inteligente de ideias de negócio
          </p>
        </div>

        <LoginForm onSuccess={() => window.location.href = '/dashboard'} />

        <div className="mt-8 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-gray-700">
            <strong>Teste:</strong> Use qualquer email para fazer login
          </p>
        </div>
      </div>
    </div>
  )
}

// Dashboard Simples
const DashboardPage = () => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user?.email}! 👋
          </h2>
          <p className="text-gray-600">
            Aqui você pode analisar suas ideias de negócio com IA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-gray-900 mb-2">
                Análise {i}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Descrição da análise de ideia {i}
              </p>
              <button className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded
                hover:bg-blue-200 transition text-sm">
                Ver Análise
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// App Principal
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          }
        />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
