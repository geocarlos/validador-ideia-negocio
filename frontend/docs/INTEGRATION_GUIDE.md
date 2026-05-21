# Guia de Integração: ValidationDetail

## 📋 Resumo Executivo

Você recebeu:
- ✅ **1 Hook**: `useValidationDetail(id)` - Busca dados da API
- ✅ **2 Componentes**: `ValidationDetail` + `BackButton` - Exibição e navegação
- ✅ **3 Exemplos**: Rota React Router, Dados Mock, Integração App.jsx
- ✅ **100% Completo**: Sem pseudo-código, sem omissões, reutiliza componentes existentes

---

## 🚀 Início Rápido (5 minutos)

### 1. Verificar Arquivos Criados

```bash
frontend/src/
├── hooks/
│   └── useValidationDetail.js          ✅ (novo)
├── components/ValidationDetail/
│   ├── index.jsx                       ✅ (novo)
│   ├── BackButton.jsx                  ✅ (novo)
│   └── README.md                       ✅ (novo)
└── examples/
    ├── ValidationDetailPage.example.jsx ✅ (novo)
    ├── ValidationDetailTest.example.jsx ✅ (novo)
    └── App.complete.jsx                (pré-existente)
```

### 2. Adicionar Rota em `App.jsx`

```javascript
// App.jsx

import { useParams } from 'react-router-dom';
import ValidationDetail from './components/ValidationDetail';

// Wrapper para extrair ID da rota
const ValidationDetailPage = () => {
  const { id } = useParams();
  return id ? <ValidationDetail id={id} /> : <Navigate to="/validations" />;
};

// Em Routes:
<Route element={<AuthGuard />}>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/validations" element={<HistoryPage />} />
  
  {/* ADICIONE ESTA LINHA */}
  <Route path="/validations/:id" element={<ValidationDetailPage />} />
</Route>
```

### 3. Adicionar Navegação em `HistoryList` ou `ValidationCard`

```javascript
// HistoryList/index.jsx ou components/HistoryList/ValidationCard.jsx

import { useNavigate } from 'react-router-dom';

function ValidationCard({ validation }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/validations/${validation.id}`);
  };

  return (
    <div 
      onClick={handleClick} 
      className="cursor-pointer hover:shadow-md transition p-4 border rounded"
    >
      {/* conteúdo existente */}
    </div>
  );
}
```

### 4. Testar

Acesse: `http://localhost:5173/validations/ALGUM_ID_VALIDO`

---

## 📁 Arquivos Detalhados

### `hooks/useValidationDetail.js`

**O que faz:**
- Busca `GET /api/validacoes/:id`
- Gerencia `loading`, `error`, `data`
- Cleanup automático (previne memory leak)
- Suporta refetch manual

**Como usar:**
```javascript
const { data, loading, error, refetch } = useValidationDetail(id);

if (loading) return <div>Carregando...</div>;
if (error) return <div>Erro: {error.message}</div>;
return <div>{data.idea}</div>;
```

**Endpoint esperado:**
```
GET /api/validacoes/:id
Status 200: { id, idea, createdAt, result, score, ... }
Status 404: { message: "Validação não encontrada" }
Status 500: { message: "Erro interno" }
```

---

### `components/ValidationDetail/index.jsx`

**O que faz:**
- Container principal
- Estados: loading, error, vazio, sucesso
- Reutiliza `AnalysisDashboard` para agentes
- Layout responsivo

**Estados:**

| Estado | Comportamento |
|--------|---------------|
| **Loading** | Spinner centralizado + BackButton |
| **Error** | Card de erro + BackButton |
| **Vazio** | "Não encontrada" + BackButton |
| **Sucesso** | Exibe todo detalhe organizado |

**Seções exibidas:**
1. Header (ID, Score)
2. Metadados (Datas)
3. Ideia Original
4. Recomendação (se existir)
5. Dashboard de Agentes (reutilizado)

---

### `components/ValidationDetail/BackButton.jsx`

**O que faz:**
- Botão reutilizável de volta
- Navegação inteligente: volta no histórico ou fallback
- Acessível e responsivo

**Uso em outros componentes:**
```javascript
import BackButton from './BackButton';

<BackButton 
  fallbackPath="/validations"
  label="Voltar"
  onClick={customHandler}
/>
```

---

## 🔌 Integração com Componentes Existentes

### ✅ Reutiliza `AnalysisDashboard`

```javascript
// ValidationDetail já faz isso automaticamente:
const analysisData = {
  technicalAnalysis: data.technicalAnalysis || data.result?.technicalAnalysis,
  marketAnalysis: data.marketAnalysis || data.result?.marketAnalysis,
  financialAnalysis: data.financialAnalysis || data.result?.financialAnalysis,
  summary: data.summary || data.result?.summary,
  score: data.score || data.result?.score,
  recommendation: data.recommendation || data.result?.recommendation,
};

<AnalysisDashboard result={analysisData} />
```

### ✅ Compatível com `validationService`

```javascript
// validationService.js já tem fetchHistory
// Para adicionar GET by ID:

const validationService = {
  // ... métodos existentes ...
  
  async fetchValidationDetail(id) {
    const response = await fetch(
      `${API_URL}/validacoes/${id}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    if (!response.ok) {
      throw new Error(response.status === 404 
        ? 'Validação não encontrada' 
        : 'Erro ao buscar validação'
      );
    }
    return response.json();
  }
};
```

---

## 📚 Exemplos de Uso

### Exemplo 1: Rota React Router

**Arquivo:** `examples/ValidationDetailPage.example.jsx`

```javascript
import { useParams } from 'react-router-dom';
import ValidationDetail from '../components/ValidationDetail';

const ValidationDetailPage = () => {
  const { id } = useParams();
  return <ValidationDetail id={id} />;
};
```

### Exemplo 2: Integração em App.jsx

**Arquivo:** `examples/App.complete.jsx`

Mostra fluxo completo:
1. Login
2. Dashboard
3. Clica em validação → vai para `/validations/:id`
4. BackButton volta

### Exemplo 3: Teste com Dados Mock

**Arquivo:** `examples/ValidationDetailTest.example.jsx`

```javascript
// Mock de dados completos
const MOCK_VALIDATION_DATA = { ... };

// Para desenvolvimento/testes:
<Route path="/test/validation" element={<ValidationDetailTest />} />
```

---

## 🧪 Testes

### Teste 1: Loading State

```bash
# Acesse a rota enquanto API está "lenta"
# Deve exibir spinner + BackButton
```

### Teste 2: Error State

```bash
# Use ID inválido: /validations/invalid-id
# Backend retorna 404
# Deve exibir card de erro
```

### Teste 3: Sucesso

```bash
# Use ID válido
# Deve exibir:
# ✓ Header com ID e score
# ✓ Datas
# ✓ Ideia original
# ✓ Dashboard de 3 agentes
# ✓ Recomendação
```

### Teste 4: Navegação

```bash
# BackButton deve:
# ✓ Voltar se houver histórico
# ✓ Ir para /validations se sem histórico
# ✓ Funcionar em mobile
```

---

## 🔐 Segurança

- ✅ ID validado antes de buscar
- ✅ Cleanup de requisições (abort controller)
- ✅ Memory leak prevention
- ✅ Tratamento seguro de erros
- ✅ Sem exposição de dados sensíveis em console

---

## 📱 Responsividade

- ✅ Mobile: Stack vertical, fonte pequena
- ✅ Tablet: Layout intermediário
- ✅ Desktop: Grid 2 colunas para metadados
- ✅ Tailwind breakpoints: sm, md, lg

---

## 🎨 Customização

### Mudar cores do BackButton

```javascript
// Em BackButton.jsx, classe className
className="flex items-center gap-2 px-4 py-2 
           text-gray-700 bg-white 
           border border-gray-300 rounded-md 
           hover:bg-gray-50"  // ← Mudar aqui
```

### Mudar fallback path

```javascript
<ValidationDetail id={id} fallbackPath="/dashboard" />
```

### Adicionar mais seções

```javascript
// Em ValidationDetail/index.jsx
// Adicione após financialAnalysis:

{data.customSection && (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-lg font-semibold mb-4">Seção Customizada</h2>
    {/* ... */}
  </div>
)}
```

---

## ⚙️ Backend: Endpoint Esperado

```javascript
// GET /api/validacoes/:id

// Resposta esperada:
{
  id: string,
  idea: string,
  createdAt: ISO8601,
  updatedAt: ISO8601,
  score: number,
  summary: string,
  recommendation: string,
  
  // Opção 1: Dados planos
  technicalAnalysis: object,
  marketAnalysis: object,
  financialAnalysis: object,
  
  // Opção 2: Nested em result
  result: {
    technicalAnalysis: object,
    marketAnalysis: object,
    financialAnalysis: object,
    summary: string,
    score: number,
    recommendation: string
  }
}
```

---

## 🐛 Troubleshooting

### "Validação não encontrada"

```
✓ ID correto no URL?
✓ Backend retorna 404 para ID inválido?
✓ Banco de dados tem registros?
```

### "Componente em branco"

```
✓ useParams() extrai ID corretamente?
✓ useValidationDetail retorna data?
✓ AnalysisDashboard carrega?
```

### "BackButton não funciona"

```
✓ useNavigate() importado?
✓ Componente dentro de <BrowserRouter>?
✓ history.length > 1?
```

### "Sem estilos"

```
✓ Tailwind CSS configurado?
✓ postcss.config.js existe?
✓ tailwind.config.js aponta src/?
```

---

## 📊 Estrutura de Dados

```javascript
// O que o hook retorna:
{
  data: {
    id: "507f...",
    idea: "Descrição da ideia",
    createdAt: "2026-05-21T14:30:00Z",
    updatedAt: "2026-05-21T14:35:00Z",
    score: 8.5,
    summary: "Resumo executivo",
    recommendation: "Recomendação",
    technicalAnalysis: {...},
    marketAnalysis: {...},
    financialAnalysis: {...},
    // OU
    result: {
      technicalAnalysis: {...},
      marketAnalysis: {...},
      financialAnalysis: {...}
    }
  },
  loading: false,
  error: null,
  refetch: () => {}
}
```

---

## 🚢 Deploy

### Verificação pré-deploy

- ✅ Rota adicionada em App.jsx?
- ✅ Hook importado em ValidationDetail?
- ✅ AnalysisDashboard disponível?
- ✅ Tailwind CSS buildado?
- ✅ Variáveis de ambiente (VITE_API_URL)?

### Comando build

```bash
npm run build
```

---

## 📞 Suporte

Se tiver dúvidas:

1. **Verifique os exemplos**:
   - `ValidationDetailPage.example.jsx` - Rota
   - `ValidationDetailTest.example.jsx` - Mock
   - `README.md` - Docs do componente

2. **Verifique o flow**:
   - Hook busca dados? (`useValidationDetail`)
   - Componente exibe? (`ValidationDetail`)
   - Navegação funciona? (`BackButton`)
   - AnalysisDashboard renderiza? (reutilizado)

3. **Logs úteis**:
   ```javascript
   console.log('Data:', data);
   console.log('Loading:', loading);
   console.log('Error:', error);
   ```

---

**Feito! Sua página de detalhe de validação está pronta. 🎉**
