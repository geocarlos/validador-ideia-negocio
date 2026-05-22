# Frontend — Validador de Ideias de Negócio

Documentação única do frontend React. Descreve arquitetura, integração com a API do backend, rotas, componentes e fluxos de uso.

---

## Visão geral

SPA em **React 18 + Vite + Tailwind CSS** que permite:

1. **Login** por e-mail (JWT emitido pelo backend)
2. **Validar ideias** com análise multiagente (mercado, técnico, financeiro)
3. **Consultar histórico** paginado com busca
4. **Ver detalhe** de uma validação
5. **Excluir** validações do histórico

O frontend comunica-se exclusivamente com o backend em `backend/` via REST JSON.

---

## Stack e requisitos

| Item | Versão / detalhe |
|------|------------------|
| React | 18 |
| Vite | 5 |
| React Router | 7 |
| Tailwind CSS | 3 |
| HTTP | `fetch` nativo (`apiClient`) |
| Testes | Vitest 4, React Testing Library, happy-dom |
| Node | 18+ recomendado |

**Backend:** deve estar rodando (porta padrão **3001**).

---

## Configuração e execução

### Variáveis de ambiente

Copie o exemplo e ajuste se necessário:

```bash
cp .env.example .env.local
```

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `VITE_API_URL` | `http://localhost:3001/api` | Base URL da API (inclui `/api`) |

### Comandos

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # produção em dist/
npm run preview    # preview do build
npm test           # Vitest (watch)
npm run test:run   # Vitest uma vez — use em CI
npm run lint       # ESLint
```

### Proxy em desenvolvimento

O `vite.config.js` faz proxy de `/api` → `http://localhost:3001`. Com isso, em dev você pode usar `VITE_API_URL=/api` se preferir evitar CORS; o padrão do projeto aponta direto para `localhost:3001/api`.

---

## Integração com a API (backend)

### Endpoints utilizados

| Método | Rota | Auth | Uso no frontend |
|--------|------|------|-----------------|
| `POST` | `/api/auth/login` | Não | `authService.login()` |
| `POST` | `/api/validar` | Bearer JWT | `validationService.validateIdea()` |
| `GET` | `/api/validacoes` | Bearer JWT | `validationService.fetchHistory()` |
| `GET` | `/api/validacoes/:id` | Bearer JWT | `validationService.getValidationDetail()` |
| `DELETE` | `/api/validacoes/:id` | Bearer JWT | `validationService.deleteValidation()` |

Rotas **não** usadas pelo frontend: `GET /health`, `GET /api-docs`.

### Autenticação

1. Login envia `{ email }` → recebe `{ token, expiresIn, userId }`.
2. Token salvo em `localStorage` (`auth_token`).
3. Requisições protegidas enviam `Authorization: Bearer <token>` via `authService.getAuthHeaders()`.
4. Resposta `401` → logout automático e redirecionamento para `/login` (`apiClient.js`).
5. Restauração de sessão: decodifica JWT localmente e valida `exp` (`authService.validateToken()`).

### Contratos importantes

**Request — validar ideia**

```json
{ "ideia": "Texto com no mínimo 20 caracteres..." }
```

**Response — validação (e detalhe)**

```json
{
  "id": "uuid",
  "ideia": "texto da ideia",
  "consolidado": {
    "mercado": { "problema", "publico_alvo", "tam", "concorrentes", "diferencial" },
    "tecnico": { "complexidade", "stack_sugerida", "componente_ia", "limitacoes_tecnicas", "mvp_estimativa" },
    "financeiro": { "modelo_receita", "custo_operacional_ia", "viabilidade_financeira", "proximo_passo" }
  },
  "metricas": {
    "tempo_execucao_ms": 1500,
    "tokens_estimados": 2400,
    "agentes_sucesso": 3,
    "agentes_erro": 0
  },
  "createdAt": "2026-05-21T12:00:00.000Z"
}
```

**Histórico — query params**

| Param | Backend | Frontend (`fetchHistory`) |
|-------|---------|---------------------------|
| `page` | Sim | Sim |
| `pageSize` | Sim | Sim |
| `search` | Sim (filtro na ideia) | Enviado como `query` → `search` |

Filtros por data (`from` / `to`) **não** existem no backend e foram removidos da UI.

**Erros do backend**

```json
{ "error": "Validation error", "details": "mensagem legível" }
```

O cliente lê `details` ou `error` (`apiConfig.parseApiError`).

### Mapeamento backend → UI

`utils/validationMapper.js` normaliza cada validação para os componentes:

| Backend | UI (componentes) |
|---------|------------------|
| `ideia` | `idea`, `ideia` |
| `consolidado.tecnico` | `technicalAnalysis` |
| `consolidado.mercado` | `marketAnalysis` |
| `consolidado.financeiro` | `financialAnalysis` |
| `metricas` | `metricas`, `metrics` |
| — | `summary` (gerado a partir de consolidado + métricas) |

---

## Arquitetura

### Camadas

```
┌─────────────────────────────────────────────────────────┐
│  UI (components/)                                       │
│  IdeaForm, HistoryList, ValidationDetail, AuthGuard...  │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  Hooks (hooks/)                                         │
│  useAuth, useValidation, useHistory, useValidationDetail│
│  useDelete, useForm                                     │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  Context (contexts/AuthContext.jsx)                     │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  Services (services/)                                     │
│  authService, validationService, apiClient, apiService    │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  Utils (utils/validationMapper.js)                      │
└───────────────────────────┬─────────────────────────────┘
                            │  HTTPS + JWT
┌───────────────────────────▼─────────────────────────────┐
│  Backend API (porta 3001)                              │
└─────────────────────────────────────────────────────────┘
```

### Princípios

- **Sem `fetch` em componentes** — chamadas HTTP ficam em `services/`.
- **Hooks** encapsulam estado (loading, error, dados) e delegam aos services.
- **Mapper** isola o formato da API do formato da UI.
- **`apiClient`** centraliza auth, erros e `401`.

### Fluxo principal: validar ideia

```
LoginForm → AuthContext.login → authService.login
    → token em localStorage

IdeaForm → useValidation → validationService.validateIdea
    → apiClient (Bearer) → POST /api/validar { ideia }
    → mapValidationResponse → AnalysisDashboard
```

### Fluxo: histórico e detalhe

```
HistoryList → useHistory → validationService.fetchHistory
    → GET /api/validacoes?page&pageSize&search

ValidationCard → Link /validations/:id

ValidationDetail → useValidationDetail → getValidationDetail
    → GET /api/validacoes/:id → AnalysisDashboard
```

### Fluxo: deletar validação

```
ValidationCard [🗑] → DeleteConfirmModal → useDelete
    → validationService.deleteValidation(id)
    → DELETE /api/validacoes/:id
    → onSuccess → HistoryList.refresh()
```

---

## Estrutura de pastas

```
frontend/
├── README.md                     ← início rápido e link para esta doc
├── docs/
│   └── README.md                 ← esta documentação
├── src/
│   ├── test/
│   │   ├── setup.js              ← cleanup RTL + jest-dom
│   │   └── helpers.js            ← localStorage mock, JWT fake, fixtures API
│   ├── App.jsx                   ← rotas principais
│   ├── main.jsx                  ← AuthProvider + render
│   ├── components/
│   │   ├── auth/                 LoginForm, AuthGuard
│   │   ├── IdeaForm/             formulário + AnalysisDashboard
│   │   ├── AnalysisDashboard/    cards mercado/técnico/financeiro
│   │   ├── HistoryList/          lista, filtros, paginação, cards
│   │   ├── ValidationDetail/     página de detalhe + BackButton
│   │   └── DeleteConfirmModal/   confirmação de exclusão
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useValidation.js
│   │   ├── useHistory.js
│   │   ├── useValidationDetail.js
│   │   ├── useDelete.js
│   │   └── useForm.js
│   ├── services/
│   │   ├── apiConfig.js          URL + parse de erros
│   │   ├── apiClient.js          fetch autenticado
│   │   ├── authService.js
│   │   ├── validationService.js
│   │   └── apiService.js         facade (compat. com exemplos)
│   ├── utils/
│   │   ├── validationMapper.js
│   │   └── validationMapper.test.js
│   ├── services/
│   │   ├── *.test.js             ← apiConfig, authService, validationService
│   └── examples/                 exemplos isolados (não usados em produção)
├── .env.example
├── vite.config.js                ← proxy dev + config Vitest
└── package.json
```

Arquivos de teste ficam ao lado do código (`*.test.js` / `*.test.jsx`), seguindo o padrão do exemplo em `src/examples/authService.test.example.js`.

---

## Rotas (`App.jsx`)

| Rota | Proteção | Conteúdo |
|------|----------|----------|
| `/login` | Pública | Formulário de login |
| `/dashboard` | `AuthGuard` | `IdeaForm` + `HistoryList` |
| `/validations/:id` | `AuthGuard` | `ValidationDetail` |
| `/` | — | Redireciona para `/dashboard` |
| `*` | — | Redireciona para `/login` |

---

## Services

### `apiConfig.js`

- `API_URL` — base da API
- `parseApiError(payload, fallback)` — extrai mensagem de erro

### `apiClient.js`

- `apiRequest(path, options)` — fetch com headers JWT, trata `401` e JSON

### `authService.js`

| Método | Descrição |
|--------|-----------|
| `login(email)` | POST login; retorna `{ token, userId, user: { id, email } }` |
| `logout()` | Remove token |
| `getToken()` | Lê `localStorage` |
| `getUserFromToken()` | Decodifica JWT (`userId`, `email`) |
| `validateToken()` | Verifica `exp` localmente |
| `getAuthHeaders()` | Headers para requisições autenticadas |

### `validationService.js`

| Método | Endpoint |
|--------|----------|
| `validateIdea(idea)` | `POST /validar` |
| `fetchHistory({ page, pageSize, query, signal })` | `GET /validacoes` |
| `getValidationDetail(id)` | `GET /validacoes/:id` |
| `deleteValidation(id)` | `DELETE /validacoes/:id` |

Todos retornam dados já mapeados por `validationMapper` (quando aplicável).

### `apiService.js`

Facade para exemplos legados; delega a `validationService` e `authService`. Métodos `*Analysis` estão marcados como deprecated.

---

## Hooks

| Hook | Responsabilidade |
|------|------------------|
| `useAuth` | Acesso ao `AuthContext` (user, login, logout, loading) |
| `useValidation` | Validar ideia: `result`, `loading`, `error`, `validateIdea` |
| `useHistory` | Lista paginada: `items`, `query`, `page`, `refresh`, etc. |
| `useValidationDetail` | Detalhe por ID: `data`, `loading`, `error`, `refetch` |
| `useDelete` | DELETE via `validationService` (extrai ID do path `/validacoes/:id`) |
| `useForm` | Formulário genérico com validação |

---

## Componentes principais

### Autenticação

- **`LoginForm`** — e-mail + submit; erros do contexto
- **`AuthGuard`** — bloqueia rotas privadas; spinner enquanto restaura sessão

### Validação

- **`IdeaForm`** — textarea, validação mínima **20 caracteres**, `useValidation` + `AnalysisDashboard`
- **`AnalysisDashboard`** — exibe `technicalAnalysis`, `marketAnalysis`, `financialAnalysis`, `summary` (objetos ou strings)
- **`LoadingState`** — feedback durante validação

### Histórico

- **`HistoryList`** — `FilterBar` (busca por texto), cards, `Pagination`
- **`ValidationCard`** — título (`ideia`), resumo, link para detalhe, botão excluir
- **`FilterBar`** — campo `search` (sem filtro por data)
- **`Pagination`** — navegação de páginas

### Detalhe

- **`ValidationDetail`** — header, ideia, métricas, `AnalysisDashboard`
- **`BackButton`** — volta no histórico ou fallback `/dashboard`

### Deleção

- **`DeleteConfirmModal`** — confirmação com loading e erro inline

---

## Testes automatizados

### Stack

| Ferramenta | Uso |
|------------|-----|
| **Vitest** | Runner (API compatível com Jest: `describe`, `it`, `expect`, `vi`) |
| **@testing-library/react** | Renderização e queries por papel/label |
| **@testing-library/user-event** | Interações realistas (digitação, clique, blur) |
| **@testing-library/jest-dom** | Matchers (`toBeInTheDocument`, etc.) |
| **happy-dom** | Ambiente DOM leve (substitui jsdom por compatibilidade com Vitest 4) |

Configuração em `vite.config.js` (`test.environment`, `setupFiles`, `pool: 'threads'`).

### Executar

```bash
cd frontend
npm run test:run    # CI — executa uma vez e encerra
npm test            # desenvolvimento — modo watch
```

### Suíte atual

| Arquivo | Função / componente | O que valida |
|---------|---------------------|--------------|
| `utils/validationMapper.test.js` | `mapValidationResponse` | `ideia` → `idea`, `consolidado.tecnico` → `technicalAnalysis`, preservação de dados, null/vazio |
| `services/apiConfig.test.js` | `parseApiError` | Prioridade `details` → `error` → `message` → fallback; payloads reais do backend |
| `services/authService.test.js` | `getUserFromToken` | JWT fake (sem lib externa), expiração, token inválido/vazio/offline |
| `services/validationService.test.js` | `validateIdea` | POST `/validar`, body `{ ideia }`, headers `Authorization` e `Content-Type`, erros de rede e HTTP |
| `components/IdeaForm/IdeaForm.test.jsx` | `IdeaForm` | Mínimo 20 caracteres, submit bloqueado quando inválido, correção remove erro, submit chama validação |

### Padrões de teste

- **Mocks:** `vi.fn()` / `vi.stubGlobal('fetch')` para HTTP; `installLocalStorageMock()` em `src/test/helpers.js` para sessão.
- **Isolamento:** `clearMocks` e `restoreMocks` no Vitest; `cleanup()` do RTL após cada teste em `src/test/setup.js`.
- **Componentes:** hooks e filhos pesados mockados (`useValidation`, `AnalysisDashboard`) para testar comportamento do formulário, não implementação interna.
- **Sem chamadas reais à API** nos testes unitários.

### Exemplo de JWT fake (helpers)

```js
import { createFakeJwt, installLocalStorageMock } from '../test/helpers';

const token = createFakeJwt({
  userId: 'user-1',
  email: 'dev@example.com',
  exp: Math.floor(Date.now() / 1000) + 3600,
});
localStorage.setItem('auth_token', token);
```

### Adicionar novos testes

1. Crie `*.test.js` ou `*.test.jsx` ao lado do módulo.
2. Reutilize `src/test/helpers.js` para JWT, `localStorage` e fixtures de erro (`apiErrorFixtures`).
3. Para componentes, prefira queries acessíveis (`getByLabelText`, `getByRole`).
4. Rode `npm run test:run` antes de abrir PR.

---

## Pasta `examples/`

Arquivos de referência **não importados** pelo `App.jsx` de produção:

- `App.complete.jsx`, `LoginPage.example.jsx` — layouts alternativos
- `ValidationDetailPage.example.jsx`, `ValidationDetailTest.example.jsx` — detalhe e mocks
- `HistoryList.example.jsx`, `DeleteExamples.example.jsx` — padrões de uso
- `DashboardAdvanced.example.jsx` — usa `apiService` (facade)

Use como referência ao estender o app; não substituem a documentação deste arquivo.

---

## Regras de validação (UI vs API)

| Regra | Frontend (`IdeaForm`) | Backend |
|-------|----------------------|---------|
| Ideia obrigatória | Sim | Sim |
| Tamanho mínimo | 20 caracteres | 20 caracteres |
| E-mail no login | Regex básico | Deve conter `@` |

---

## Troubleshooting

### Login falha / “Erro ao fazer login”

- Backend rodando em `http://localhost:3001`?
- `VITE_API_URL` correto em `.env.local`?
- E-mail válido (com `@`)?

### 401 em validar ou listar histórico

- Fez login antes? Token em `localStorage` (`auth_token`)?
- Token expirado (7 dias)? Faça login novamente.

### Resultado da validação vazio na tela

- Verifique Network: resposta deve ter `consolidado`. O mapper preenche os cards automaticamente.

### Busca no histórico não filtra

- Query param deve ser `search` (já corrigido no `validationService`).

### CORS em desenvolvimento

- Use proxy do Vite (`/api`) ou configure `cors` no backend (já habilitado).

### Build

```bash
npm run build
```

Se falhar, confira imports e variáveis `import.meta.env`.

---

## Checklist para novos desenvolvedores

- [ ] Backend na porta 3001
- [ ] `.env.local` com `VITE_API_URL`
- [ ] `npm run dev` no frontend
- [ ] Login com e-mail válido
- [ ] Validar ideia com ≥ 20 caracteres
- [ ] Histórico lista itens após validação
- [ ] “Ver detalhes” abre `/validations/:id`
- [ ] Excluir item atualiza a lista
- [ ] DevTools → Network: `Authorization` e body `{ ideia }` corretos
- [ ] `npm run test:run` passa localmente

---

## Evolução sugerida (não implementado)

- Rota dedicada `/validations` só para histórico
- Testes E2E (Playwright) contra API real
- Workflow CI executando `npm run test:run` no frontend
- Cobertura de código (`@vitest/coverage-v8`)
- Tipagem TypeScript compartilhada com OpenAPI
- Exportar PDF do detalhe da validação
- Filtro por data no backend + UI
- Revalidação do `useForm` em tempo real ao digitar (UX do `IdeaForm`)

---

**Última atualização:** maio/2026 — inclui suíte Vitest (28 testes) e alinhamento com a API em `backend/src/routes/`.
