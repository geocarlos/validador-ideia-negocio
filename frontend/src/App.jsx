import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import useAuth from './hooks/useAuth'
import LoginForm from './components/auth/LoginForm'
import AuthGuard from './components/auth/AuthGuard'
import IdeaForm from './components/IdeaForm/IdeaForm'
import HistoryList from './components/HistoryList'
import ValidationDetail from './components/ValidationDetail'

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
            Validador de Ideias
          </h1>
          <p className="text-gray-600">
            Análise inteligente de ideias de negócio
          </p>
        </div>

        <LoginForm onSuccess={() => { window.location.href = '/dashboard' }} />

        <div className="mt-8 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-gray-700">
            Use um e-mail válido para entrar. Novos usuários são cadastrados automaticamente.
          </p>
        </div>
      </div>
    </div>
  )
}

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <a href="/dashboard" className="font-bold text-xl text-blue-600">
            Validador de Ideias
          </a>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="font-medium text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-500">ID: {user.id}</p>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
    </div>
  )
}

const DashboardPage = () => {
  const { user } = useAuth()

  return (
    <AppLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo, {user?.email}
        </h2>
        <p className="text-gray-600">
          Valide novas ideias ou consulte o histórico de análises
        </p>
      </div>

      <div className="mb-8">
        <IdeaForm />
      </div>

      <HistoryList />
    </AppLayout>
  )
}

const ValidationDetailPage = () => {
  const { id } = useParams()

  return (
    <AuthGuard>
      <ValidationDetail id={id} />
    </AuthGuard>
  )
}

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

        <Route path="/validations/:id" element={<ValidationDetailPage />} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
