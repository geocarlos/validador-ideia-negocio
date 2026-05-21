# ValidationDetail Component

## Descrição
Componente responsável por exibir todos os detalhes de uma validação específica integrado ao endpoint `GET /api/validacoes/:id`.

## Estrutura

```
ValidationDetail/
├── index.jsx           # Container principal
├── BackButton.jsx      # Componente de navegação
└── README.md          # Este arquivo
```

## Componentes

### ValidationDetail (index.jsx)
Componente container que:
- Busca dados de uma validação por ID
- Exibe loading state
- Exibe error state
- Organiza a apresentação em seções:
  - **Header**: ID, score (se existir)
  - **Metadados**: Datas de criação/atualização
  - **Ideia Original**: Texto da ideia de negócio
  - **Recomendação**: Texto em destaque (se existir)
  - **Dashboard de Análise**: Reutiliza `AnalysisDashboard` para exibir os 3 agentes

### BackButton (BackButton.jsx)
Componente reutilizável que:
- Navega de volta com `navigate(-1)`
- Fallback para rota padrão se não houver histórico
- Design consistente com o resto da aplicação
- Aceita customização de label e callback

## Hooks

### useValidationDetail(id)
Hook customizado que:
- **Endpoint**: `GET /api/validacoes/:id`
- **Estados**: loading, error, data
- **Gerencia**: lifecycle com cleanup (memory leak prevention)
- **Refetch**: suporta atualização manual de dados
- **Tratamento de erro**: captura e normaliza mensagens

**Retorno:**
```javascript
{
  data: Object|null,      // Dados completos da validação
  loading: Boolean,       // Estado de carregamento
  error: Error|null,      // Erro se houver
  refetch: Function       // Função para refetch manual
}
```

## Integração com AnalysisDashboard

O componente reutiliza o `AnalysisDashboard` existente, mapeando os dados:

```javascript
const analysisData = {
  technicalAnalysis: data.technicalAnalysis || data.result?.technicalAnalysis,
  marketAnalysis: data.marketAnalysis || data.result?.marketAnalysis,
  financialAnalysis: data.financialAnalysis || data.result?.financialAnalysis,
  summary: data.summary || data.result?.summary,
  score: data.score || data.result?.score,
  recommendation: data.recommendation || data.result?.recommendation,
};
```

## Uso

### Rota React Router

```javascript
// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ValidationDetail from './components/ValidationDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Outras rotas... */}
        <Route 
          path="/validations/:id" 
          element={<ValidationDetailPage />} 
        />
      </Routes>
    </Router>
  );
}

// Página wrapper
function ValidationDetailPage() {
  const { id } = useParams();
  return <ValidationDetail id={id} />;
}
```

### Navegação para Detalhe

```javascript
// De HistoryList.jsx ou outro componente
import { useNavigate } from 'react-router-dom';

const handleViewDetail = (validationId) => {
  navigate(`/validations/${validationId}`);
};

// Ou com link direto
<Link to={`/validations/${validation.id}`}>Ver Detalhe</Link>
```

## Estados

### Loading
- Spinner centralizado
- Mensagem "Carregando validação..."
- BackButton sempre acessível

### Error
- Card de erro com ícone
- Mensagem customizada ou padrão
- BackButton para sair

### Vazio
- Message "Validação não encontrada"
- BackButton para retornar

### Sucesso
- Exibe todos os detalhes organizados
- Layout responsivo (mobile-first)
- Reutiliza AnalysisDashboard para agentes

## Responsividade

- **Mobile**: Stack vertical, font reduzida, padding reduzido
- **Desktop**: Layouts múltiplos, grid 2 colunas para metadados
- **Breakpoints**: sm, md, lg (Tailwind padrão)

## Tratamento de Dados

### Flexibilidade de Estrutura
O componente trata múltiplas estruturas possíveis:

```javascript
// Opção 1: Dados planos
{
  technicalAnalysis: {...},
  marketAnalysis: {...},
  financialAnalysis: {...}
}

// Opção 2: Dados nested em result
{
  result: {
    technicalAnalysis: {...},
    marketAnalysis: {...},
    financialAnalysis: {...}
  }
}

// O componente normaliza ambas
```

### Formatação de Datas
Usa `toLocaleString('pt-BR')` para formato brasileiro.

### Formatação de Score
Se existir, exibe em card destacado com 1 casa decimal.

## Separação de Responsabilidades

1. **useValidationDetail**: Busca e gerencia dados
2. **ValidationDetail**: Organização e layout
3. **BackButton**: Navegação reutilizável
4. **AnalysisDashboard**: Exibição de agentes (reutilizado)
5. **Componentes de Análise**: TechnicalAnalysis, MarketAnalysis, FinancialAnalysis

## Performance

- **Memory Leak Prevention**: Cleanup em useEffect
- **Abort Controller**: Requisições podem ser abortadas
- **Lazy**: Componente reutilizado (AnalysisDashboard) já está otimizado

## Acessibilidade

- Botões com `aria-label`
- Hierarquia de headings (h1, h2, h3)
- Cores com suficiente contraste
- Suporta navegação por teclado
