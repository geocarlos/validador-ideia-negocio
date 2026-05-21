# Arquitetura: ValidationDetail

## 📊 Diagrama de Componentes

```
App.jsx
  ├─ Routes
  │   └─ /validations/:id
  │       └─ ValidationDetailPage (wrapper)
  │           ├─ useParams() → extrai :id
  │           └─ <ValidationDetail id={id} />
  │
  ├─ Componentes
  │   └─ ValidationDetail/
  │       ├─ BackButton.jsx (navegação)
  │       └─ index.jsx (container)
  │           ├─ useValidationDetail(id) → hook customizado
  │           │   └─ fetch GET /api/validacoes/:id
  │           │
  │           ├─ Header (ID, Score)
  │           ├─ Metadados (Datas)
  │           ├─ IdeaSection
  │           ├─ RecommendationCard
  │           └─ <AnalysisDashboard /> (reutilizado)
  │               ├─ <TechnicalAnalysis />
  │               ├─ <MarketAnalysis />
  │               └─ <FinancialAnalysis />
  │
  └─ Hooks
      ├─ useValidationDetail.js (novo)
      │   └─ Manage: loading, error, data, refetch
      │
      └─ useAuth.js (existente)
```

---

## 🔄 Fluxo de Dados

```
1. User clica em ValidationCard em /validations
   ↓
2. navigate(`/validations/${validation.id}`)
   ↓
3. Rota ativa ValidationDetailPage
   ↓
4. useParams() extrai :id
   ↓
5. <ValidationDetail id={id} />
   ↓
6. useValidationDetail(id) chama
   GET /api/validacoes/:id
   ↓
7. Backend retorna:
   {
     id, idea, createdAt, updatedAt, score,
     technicalAnalysis, marketAnalysis, financialAnalysis,
     summary, recommendation
   }
   ↓
8. Hook retorna: { data, loading, error }
   ↓
9. ValidationDetail renderiza:
   - Header com ID + Score
   - Metadados (datas)
   - Ideia
   - AnalysisDashboard (agentes)
   ↓
10. User clica BackButton
    ↓
11. navigate(-1) volta ou navigate('/validations')
```

---

## 📂 Estrutura de Arquivos Criados

```
frontend/src/

hooks/
├── useAuth.js (existente)
├── useForm.js (existente)
├── useHistory.js (existente)
├── useValidation.js (existente)
└── useValidationDetail.js ✨ NOVO
    └─ Busca GET /api/validacoes/:id

components/
├── auth/ (existente)
├── IdeaForm/ (existente)
├── AnalysisDashboard/ (existente - reutilizado)
│   ├── TechnicalAnalysis.jsx
│   ├── MarketAnalysis.jsx
│   ├── FinancialAnalysis.jsx
│   └── SummaryCard.jsx
├── HistoryList/ (existente)
│   └── ValidationCard.jsx (navega para detail)
│
└── ValidationDetail/ ✨ NOVO
    ├── index.jsx
    │   └─ Container principal, reutiliza AnalysisDashboard
    ├── BackButton.jsx
    │   └─ Componente reutilizável de navegação
    └── README.md
        └─ Documentação do componente

examples/
├── LoginPage.example.jsx (existente)
├── DashboardPage.example.jsx (existente)
├── App.complete.jsx (existente)
├── ValidationDetailPage.example.jsx ✨ NOVO
│   └─ Como adicionar rota em App.jsx
├── ValidationDetailTest.example.jsx ✨ NOVO
│   └─ Teste com dados mock
└── ... (outros exemplos)

docs/
├── (conteúdo existente)
└── INTEGRATION_GUIDE.md ✨ NOVO
    └─ Guia passo-a-passo de integração
```

---

## 🎯 Responsabilidades

### `useValidationDetail.js`
- ✅ Fetch de dados (GET /api/validacoes/:id)
- ✅ Gerenciar loading, error, data
- ✅ Cleanup automático (memory leak prevention)
- ✅ Refetch manual
- ✅ Tratamento de erros

### `BackButton.jsx`
- ✅ Navegação volta
- ✅ Fallback path
- ✅ Ícone + label
- ✅ Acessibilidade

### `ValidationDetail/index.jsx`
- ✅ Usar hook para dados
- ✅ Gerenciar states (loading, error, vazio)
- ✅ Renderizar layout
- ✅ Reutilizar AnalysisDashboard
- ✅ Exibir Header, Metadados, Ideia, Recomendação
- ✅ Responsividade

---

## 🔗 Integração com Existentes

| Componente | Como Reutiliza |
|-----------|-----------------|
| AnalysisDashboard | Renderiza 3 agentes (Tech, Market, Financial) |
| ValidationCard | Add navegação para /validations/:id |
| validationService | Add método fetchValidationDetail ou usar direto fetch |
| useAuth | Protege rota com AuthGuard |
| Tailwind | Estilos responsivos |

---

## 🧪 Estados Renderizados

### Loading
```
┌──────────────────────────────┐
│ ← Voltar                     │
├──────────────────────────────┤
│                              │
│      ⟳ Carregando...        │
│                              │
└──────────────────────────────┘
```

### Error
```
┌──────────────────────────────┐
│ ← Voltar                     │
├──────────────────────────────┤
│ ⚠ Erro ao carregar           │
│                              │
│ Mensagem de erro             │
└──────────────────────────────┘
```

### Vazio
```
┌──────────────────────────────┐
│ ← Voltar                     │
├──────────────────────────────┤
│ ✓                            │
│ Validação não encontrada     │
│                              │
└──────────────────────────────┘
```

### Sucesso
```
┌──────────────────────────────────┐
│ ← Voltar                         │
├──────────────────────────────────┤
│ Detalhe da Validação    Score: 8.5
├──────────────────────────────────┤
│ ID: 507f1f77bcf86cd799439011     │
│                                  │
│ Criada em: 21/05/2026 14:30      │
│ Atualizada em: 21/05/2026 14:35  │
├──────────────────────────────────┤
│ Ideia de Negócio                 │
│                                  │
│ [Texto longo da ideia...]        │
├──────────────────────────────────┤
│ Recomendação                     │
│                                  │
│ [Texto da recomendação...]       │
├──────────────────────────────────┤
│ Análise Técnica                  │
│ [...dados do agente...]          │
│                                  │
│ Análise de Mercado               │
│ [...dados do agente...]          │
│                                  │
│ Análise Financeira               │
│ [...dados do agente...]          │
├──────────────────────────────────┤
│              ← Voltar            │
└──────────────────────────────────┘
```

---

## 🔐 Tratamento de Erros

```
GET /api/validacoes/invalid-id

┌─────────────────────┐
│ 404 - Not Found     │
│ {                   │
│   message: "..."    │
│ }                   │
└─────────────────────┘
         ↓
  Capturado em hook
         ↓
  setError(error)
         ↓
  ValidationDetail renderiza
  card de erro
```

---

## 📱 Responsividade Esperada

### Mobile (< 640px)
- Stack vertical
- Fonte: 16px-18px
- Padding: p-4, p-6
- Grid: 1 coluna

### Tablet (640px - 1024px)
- Stack vertical ou 2 colunas
- Fonte: 16px
- Grid: pode ser 2 colunas

### Desktop (> 1024px)
- Layout completo
- Fonte: 16px-18px
- Padding: p-6, p-8
- Grid: 2-3 colunas

---

## 🚀 Inicialização

### 1️⃣ Imports necessários
```javascript
import { useParams } from 'react-router-dom';
import ValidationDetail from './components/ValidationDetail';
```

### 2️⃣ Rota em App.jsx
```javascript
<Route path="/validations/:id" element={<ValidationDetailPage />} />
```

### 3️⃣ Navegação em HistoryList
```javascript
navigate(`/validations/${validation.id}`);
```

### 4️⃣ Testar
```bash
http://localhost:5173/validations/algum-id-valido
```

---

## 📈 Escalabilidade

### Adicionar mais seções
```javascript
// Em ValidationDetail/index.jsx
{data.extraSection && <ExtraSection data={data.extraSection} />}
```

### Reutilizar em outros contextos
```javascript
// BackButton é genérico
<BackButton fallbackPath="/dashboard" label="Sair" />

// Hook é genérico
const { data } = useValidationDetail(id);
```

### Adicionar filtros ou ações
```javascript
// Em ValidationDetail
<button onClick={() => handleExport(data)}>Exportar PDF</button>
<button onClick={() => handleShare(data)}>Compartilhar</button>
```

---

## ✅ Checklist de Integração

- [ ] Hook criado: `useValidationDetail.js`
- [ ] Componente criado: `ValidationDetail/index.jsx`
- [ ] BackButton criado: `ValidationDetail/BackButton.jsx`
- [ ] Rota adicionada em `App.jsx`: `/validations/:id`
- [ ] Navegação adicionada em `HistoryList` ou `ValidationCard`
- [ ] Testado loading state
- [ ] Testado error state
- [ ] Testado sucesso com ID válido
- [ ] Testado BackButton
- [ ] Verificado responsividade mobile/tablet/desktop
- [ ] Variáveis de ambiente configuradas (`VITE_API_URL`)
- [ ] Endpoint `/api/validacoes/:id` implementado no backend

---

**Fim da Documentação Arquitetural** 🎉
