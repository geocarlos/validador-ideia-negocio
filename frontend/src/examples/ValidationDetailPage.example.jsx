/**
 * Exemplo completo: ValidationDetailPage com React Router
 * 
 * Mostra como integrar ValidationDetail em uma aplicação React com routing
 * Inclui:
 * - Rota dinâmica com useParams
 * - Integração com App.jsx
 * - Componente wrapper
 * - Navegação de volta para histórico
 */

import { useParams, useNavigate } from 'react-router-dom';
import ValidationDetail from '../components/ValidationDetail';

/**
 * Page wrapper - Separa a lógica de rota do componente
 * Responsável por:
 * - Extrair ID da rota
 * - Passar para ValidationDetail
 * - Tratamento de ID inválido
 */
const ValidationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Validar ID
  if (!id || id.trim() === '') {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">ID Inválido</h1>
          <p className="text-gray-600 mt-2">
            O ID da validação não foi fornecido ou é inválido.
          </p>
          <button
            onClick={() => navigate('/validations')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Voltar para Histórico
          </button>
        </div>
      </div>
    );
  }

  return <ValidationDetail id={id} />;
};

export default ValidationDetailPage;

/**
 * Exemplo de integração em App.jsx
 * 
 * import ValidationDetailPage from './examples/ValidationDetailPage.example';
 * 
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <Routes>
 *         <Route path="/login" element={<LoginPage />} />
 *         <Route element={<AuthGuard />}>
 *           <Route path="/dashboard" element={<DashboardPage />} />
 *           <Route path="/validations" element={<HistoryPage />} />
 *           <Route path="/validations/:id" element={<ValidationDetailPage />} />
 *         </Route>
 *       </Routes>
 *     </BrowserRouter>
 *   );
 * }
 */

/**
 * Exemplo de navegação de HistoryList para Detalhe
 * 
 * Em HistoryList/index.jsx ou ValidationCard.jsx:
 * 
 * import { useNavigate } from 'react-router-dom';
 * 
 * export default function ValidationCard({ validation, onDetail }) {
 *   const navigate = useNavigate();
 * 
 *   const handleViewDetail = () => {
 *     // Opção 1: Com navegação
 *     navigate(`/validations/${validation.id}`);
 * 
 *     // Opção 2: Com callback
 *     if (onDetail) onDetail(validation.id);
 *   };
 * 
 *   return (
 *     <div 
 *       onClick={handleViewDetail}
 *       className="cursor-pointer hover:shadow-md transition"
 *     >
 *       { Conteúdo do card }
 *     </div>
 *   );
 * }
 */

/**
 * Exemplo: Link direto
 * 
 * import { Link } from 'react-router-dom';
 * 
 * <Link 
 *   to={`/validations/${validation.id}`}
 *   className="text-blue-600 hover:text-blue-800 underline"
 * >
 *   Ver Detalhe
 * </Link>
 */

/**
 * Teste manual (sem rota)
 * 
 * Se quiser testar sem routing, pode mockar o useParams:
 * 
 * import ValidationDetail from '../components/ValidationDetail';
 * 
 * export default function TestPage() {
 *   const mockId = '507f1f77bcf86cd799439011'; // ID de teste
 *   return <ValidationDetail id={mockId} />;
 * }
 */
