# Validador de Ideia de Negócio

Sistema de IA multiagente que fornece **análise instantânea e estruturada** de ideias de negócio em três dimensões especializadas: mercado, viabilidade técnica e viabilidade financeira.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Stack Tecnológica](#stack-tecnológica)
- [Estrutura do Repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Instalação e Execução](#instalação-e-execução)
- [Testes](#testes)
- [API – Endpoints Principais](#api--endpoints-principais)
- [Fluxo de Contribuição](#fluxo-de-contribuição)

---

## Visão Geral

Empreendedores e fundadores de startups perdem tempo e dinheiro buscando feedback para suas ideias. Este sistema resolve esse problema entregando análise em nível profissional em menos de 15 segundos, sem custo para o usuário final.

Três agentes OpenAI especializados executam **em paralelo** para cada ideia submetida:

| Agente | Responsabilidade |
|---|---|
| **Mercado** | Problema, público-alvo, TAM, concorrência e diferencial |
| **Técnico** | Stack sugerida, complexidade, componente de IA, estimativa de MVP |
| **Financeiro** | Modelo de receita, custo operacional de IA, viabilidade financeira e próximos passos |

O resultado é consolidado pelo orquestrador e persistido no banco de dados. Falhas parciais de agentes não derrubam a requisição – o campo de erro é retornado por agente.

---

## Arquitetura

```
Cliente (React)
     │
     ▼
Express API (backend/src/app.js)
     │
     ├── /auth/login          – JWT sem senha (email only)
     ├── /api/validar         – POST protegido → Orquestrador
     └── /api/validacoes      – CRUD de histórico autenticado
              │
              ▼
     Orchestrator (execução paralela)
        ├── MercadoAgent   → OpenAI gpt-4o-mini
        ├── TecnicoAgent   → OpenAI gpt-4o-mini
        └── FinanceiroAgent → OpenAI gpt-4o-mini
              │
              ▼
     Prisma ORM → SQLite
```

---

## Stack Tecnológica

**Backend**
- Node.js + Express 4
- Prisma ORM 5 com SQLite
- JWT (`jsonwebtoken`)
- OpenAI API (`gpt-4o-mini`)
- Swagger UI (`swagger-ui-express`)
- Jest + Supertest (testes)
- Nodemon (desenvolvimento)

**Frontend**
- React + Tailwind CSS
- Axios (chamadas à API)
- localStorage (persistência de token)

**Infraestrutura**
- SQLite (desenvolvimento local)
- Variáveis de ambiente via `dotenv`

---

## Estrutura do Repositório

```
validador-ideia-negocio/
├── backend/
│   ├── src/
│   │   ├── app.js                      # Entry point Express
│   │   ├── agents/
│   │   │   ├── mercadoAgent.js
│   │   │   ├── tecnicoAgent.js
│   │   │   └── financeiroAgent.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── orchestrator/
│   │   │   └── validacaoOrchestrator.js
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── client.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── validar.js
│   │   │   └── index.js
│   │   └── services/
│   │       ├── authService.js
│   │       └── validationService.js
│   ├── tests/
│   │   ├── agents/agents.test.js
│   │   ├── orchestrator/orchestrator.test.js
│   │   └── routes/
│   │       ├── auth.test.js
│   │       └── validar.test.js
│   └── package.json
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── IdeaForm/
│       │   ├── AnalysisDashboard/
│       │   └── HistoryList/
│       ├── hooks/
│       └── services/
├── docs/
│   ├── api/openapi.yaml
│   ├── prompts.md
│   └── ai/system-context.md
├── PRD.md
└── README.md
```

---

## Pré-requisitos

- **Node.js** >= 18
- **npm** >= 9
- Conta na [OpenAI Platform](https://platform.openai.com/) com chave de API ativa
- (Opcional) Cliente REST para testar a API – ex: Postman ou curl

---

## Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/` com base nas variáveis abaixo:

```dotenv
# OpenAI
OPENAI_API_KEY=sk-...

# JWT
JWT_SECRET=seu_segredo_jwt_aqui
JWT_EXPIRES_IN=7d

# Banco de dados (Prisma/SQLite)
DATABASE_URL="file:./dev.db"

# Servidor
PORT=3001
```

> **Nunca** comite o arquivo `.env` no repositório. O arquivo `.gitignore` já deve excluí-lo.

---

## Instalação e Execução

### Backend

```bash
# 1. Instalar dependências
cd backend
npm install

# 2. Aplicar migrações do banco de dados
npx prisma migrate dev

# 3. Iniciar em modo desenvolvimento
npm run dev
```

O servidor sobe em `http://localhost:3001`.  
A documentação Swagger fica disponível em `http://localhost:3001/api-docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Testes

```bash
cd backend

# Executar toda a suíte
npm test

# Com coverage
npx jest --coverage
```

A suíte cobre:
- Contrato de campos obrigatórios de cada agente
- Orquestrador: sucesso total e falha parcial
- Rotas `POST /auth/login` e `POST /api/validar` (401 sem token, 200 com token)

---

## API – Endpoints Principais

Base URL (desenvolvimento): `http://localhost:3001`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/auth/login` | ✗ | Login por e-mail – retorna JWT |
| `GET` | `/health` | ✗ | Health check do sistema |
| `POST` | `/api/validar` | ✓ | Submete ideia para análise multiagente |
| `GET` | `/api/validacoes` | ✓ | Lista histórico paginado do usuário |
| `GET` | `/api/validacoes/:id` | ✓ | Detalha uma validação específica |
| `DELETE` | `/api/validacoes/:id` | ✓ | Remove uma validação do histórico |

**Exemplo – login:**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Exemplo – validar ideia:**
```bash
curl -X POST http://localhost:3001/api/validar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"ideia": "Uma plataforma SaaS para freelancers especializados em IA com pagamento recorrente e trilhas de crescimento."}'
```

O contrato completo da API está em [docs/api/openapi.yaml](docs/api/openapi.yaml).

---

## Fluxo de Contribuição

### Padrão de branches

| Prefixo | Uso |
|---|---|
| `main` | Código estável e revisado |
| `feature/<descricao>` | Nova funcionalidade (ex: `feature/tests-docs`) |
| `fix/<descricao>` | Correção de bug |
| `docs/<descricao>` | Documentação |
| `test/<descricao>` | Adição ou ajuste de testes |
| `refactor/<descricao>` | Refatoração sem mudança de comportamento |

### Padrão de commits (Conventional Commits)

```
<tipo>(escopo): mensagem curta no imperativo

Exemplos:
feat(agents): adicionar validação de schema no agente financeiro
fix(auth): corrigir expiração do JWT em ambiente de teste
docs(readme): adicionar seção de variáveis de ambiente
test(orchestrator): cobrir cenário de falha parcial
```

### Pull Requests

1. Abra a branch a partir de `main`
2. Garanta que `npm test` passa sem falhas
3. Preencha o template de PR (`.github/pull_request_template.md`)
4. Solicite revisão conforme a área de ownership definida em `.github/CODEOWNERS`

### Ownership por área

| Área | Responsável |
|---|---|
| Arquitetura backend - API REST | Luiz |
| Arquitetura backend - orchestrator | Geocarlos |
| Serviço OpenAI e agentes | Geocarlos |
| Prisma schema, migrações e auth | Luiz |
| Frontend (React + Tailwind) | Vanessa |
| Testes, cobertura e documentação | Vanessa |
