# Nossos Prompts

## Criar branch e estrutura de pastas do projeto

### Contexto
Consulte o plano geral do projeto em `../plan-validadorIdeiaNegocio.prompt.md` antes de executar qualquer ação.

### Tarefas

1. **Criar o branch**
   - Leia o plano geral para identificar o nome do branch definido
   - Crie o branch conforme a tarefa a partir de `develop` 
   - Faça checkout para o novo branch

2. **Criar a estrutura de pastas**
   - Com base na estrutura definida no plano geral, crie **todos** os diretórios listados, 
   - Para cada pasta, adicione um arquivo `.gitkeep` (ou `README.md` se especificado no plano) para que o Git rastreie os diretórios vazios

3. **Commit inicial**
   - Faça um commit com a mensagem: `chore: estrutura inicial de pastas conforme plano geral`

### Restrições
- Não crie arquivos além dos especificados no plano geral
- Não modifique nenhum arquivo existente em `main`
- Se o branch já existir, pergunte antes de sobrescrevê-lo

### Saída esperada
Ao final, liste os diretórios criados e confirme o nome do branch ativo.


## Criar branch e contrato da API REST

### Contexto
Consulte o plano geral do projeto em `../plan-validadorIdeiaNegocio.prompt.md` antes de
executar qualquer ação. Extraia dele:
- Nome do branch a ser criado
- Endpoints definidos (rotas, métodos HTTP, payloads, respostas)
- Padrões de nomenclatura e versionamento adotados no projeto

### Tarefas

1. **Criar o branch**
   - Crie o branch a partir de `develop`
   - Faça checkout para o novo branch
   - Se o branch já existir, interrompa e pergunte antes de prosseguir

2. **Gerar o contrato da API REST**
   - Crie o arquivo de contrato no formato **OpenAPI 3.1** (YAML ou JSON, conforme
     padrão do projeto)
   - Para cada endpoint definido no plano geral, documente:
     - Método HTTP e rota (ex: `POST /api/v1/ideias`)
     - Descrição funcional do endpoint
     - Parâmetros de path, query e headers (quando aplicável)
     - Schema do request body (com tipos, campos obrigatórios e exemplos)
     - Schemas de resposta para os status codes relevantes
       (200/201, 400, 401, 404, 422, 500)
     - Exemplos de request e response realistas
   - Defina os componentes reutilizáveis em `components/schemas` para evitar
     duplicação
   - Inclua a seção `info` com título, versão e descrição do projeto
   - Inclua a seção `servers` com a URL base de desenvolvimento

3. **Validar o contrato**
   - Verifique se o YAML/JSON gerado é sintaticamente válido
   - Confirme que todos os endpoints do plano geral foram cobertos

4. **Commit inicial**
   - Salve o arquivo no caminho definido no plano geral (ou em `docs/api/openapi.yaml`
     como fallback)
   - Faça commit com a mensagem: `docs: contrato OpenAPI da API REST conforme plano geral`

### Restrições
- Não invente endpoints além dos definidos no plano geral
- Não modifique arquivos em `main`
- Campos sensíveis (tokens, senhas) devem usar `format: password` ou ser
  referenciados via headers de autenticação — nunca embutidos nos exemplos

### Saída esperada
Ao final, liste:
- Nome do branch criado e ativo
- Caminho do arquivo de contrato gerado
- Endpoints documentados (método + rota)
- Qualquer ambiguidade encontrada no plano geral que precise de esclarecimento

## Criar o README principal do repositório

### Contexto
Consulte o plano geral do projeto em `../plan-validadorIdeiaNegocio.prompt.md` antes de
executar qualquer ação. Extraia dele:
- Nome, descrição e propósito do projeto
- Stack tecnológica (linguagens, frameworks, banco de dados, serviços externos)
- Estrutura de pastas do repositório
- Endpoints principais da API (se houver contrato já definido)
- Pré-requisitos e dependências necessárias para rodar o projeto
- Variáveis de ambiente necessárias
- Fluxo de contribuição e padrões de branch/comm

## Criar o README principal do repositório

### Contexto
Consulte o plano geral do projeto em `../plan-validadorIdeiaNegocio.prompt.md` antes de
executar qualquer ação. Extraia dele:
- Nome, descrição e propósito do projeto
- Stack tecnológica (linguagens, frameworks, banco de dados, serviços externos)
- Estrutura de pastas do repositório
- Endpoints principais da API (se houver contrato já definido)
- Pré-requisitos e dependências necessárias para rodar o projeto
- Variáveis de ambiente necessárias
- Fluxo de contribuição e padrões de branch/commit adotados

### Tarefas

1. **Verificar artefatos já existentes no repositório**
   - Se já existir um `README.md` na raiz, leia seu conteúdo antes de sobrescrever
   - Se existir `docs/api/openapi.yaml`, extraia os endpoints para a seção de API
   - Se existir `.env.example`, use-o como base para a seção de variáveis de ambiente

2. **Gerar o README.md**
   Crie o arquivo `README.md` na raiz do repositório com seções definidas conforme o PRD e plano geral.

## Criar documentação UML — Diagramas de Sequência e de Classes

### Contexto
Consulte o plano geral do projeto em `../plan-validadorIdeiaNegocio.prompt.md` antes de
executar qualquer ação. Consulte também os artefatos já existentes no repositório:
- `docs/api/openapi.yaml` — para extrair fluxos de requisição/resposta e entidades
- Código-fonte existente (se houver) — para refletir a implementação real nas classes
- `README.md` — para confirmar stack e camada de arquitetura adotada

Extraia do plano geral:
- Atores do sistema (usuário, serviços externos, workers, etc.)
- Casos de uso e fluxos principais (happy path e fluxos alternativos)
- Entidades do domínio, seus atributos e relacionamentos
- Padrões arquiteturais adotados (MVC, Clean Architecture, DDD, etc.)

### Tarefas

1. **Definir o formato de saída**
   - Gere todos os diagramas em **Mermaid** (`.md` com bloco ```mermaid```)
   - Como alternativa complementar, gere também em **PlantUML** (`.puml`) se o
     plano geral indicar uso dessa ferramenta
   - Salve os arquivos em `docs/uml/`

2. **Diagrama de Sequência UML**
   Crie um diagrama de sequência para **cada fluxo principal** identificado
   no plano geral. Para cada diagrama:

   - Identifique e represente todos os participantes:
     `Usuário | Frontend | API Gateway | Controller | Service | Repository | DB |
     Serviço Externo`
     (use apenas os que existem na arquitetura do projeto)
   - Cubra obrigatoriamente:
     - Fluxo principal (happy path) completo, do request à resposta final
     - Fluxo alternativo de erro mais relevante (ex: validação, não encontrado,
       falha externa)
     - Chamadas assíncronas e callbacks, se existirem (use `-->>`

## Avaliar prontidão do repositório e planejar criação dos Agentes de IA

### Contexto
Consulte os seguintes artefatos antes de qualquer ação:
- `../plan-validadorIdeiaNegocio.prompt.md` — plano geral do projeto
- `docs/api/openapi.yaml` — contrato da API REST
- `docs/uml/` — diagramas de sequência e classes
- `README.md` — stack, estrutura e estado atual do projeto
- Código-fonte existente em `src/` (ou equivalente definido no plano geral)

### Fase 1 — Auditoria de Prontidão

Antes de qualquer criação, faça uma auditoria estruturada do repositório.
Avalie cada item abaixo e classifique como ✅ Completo | 🚧 Parcial | ❌ Ausente:

#### 1.1 Fundação do projeto
- [ ] Estrutura de pastas criada conforme plano geral
- [ ] README principal completo e atualizado
- [ ] Variáveis de ambiente documentadas (`.env.example`)
- [ ] Dependências declaradas (`package.json`, `requirements.txt` ou equivalente)

#### 1.2 Contrato e domínio
- [ ] Contrato da API REST definido (`openapi.yaml`)
- [ ] Diagrama de classes com entidades do domínio
- [ ] Modelos/schemas de dados implementados no código
- [ ] Endpoints base da API implementados (mesmo que sem lógica de negócio)

#### 1.3 Infraestrutura de agentes
- [ ] Dependência do SDK de LLM adicionada ao projeto
  (LangChain, OpenAI SDK, Anthropic SDK, Vercel AI SDK ou equivalente)
- [ ] Variáveis de ambiente para chaves de API dos modelos declaradas
- [ ] Pasta destinada aos agentes existe e está na estrutura do projeto
- [ ] Padrão de interface/contrato para agentes definido no plano geral
  (input, output, formato de resposta esperado)

#### 1.4 Definição dos agentes no plano geral
- [ ] Agente Mercado: objetivo, inputs, outputs e critérios de avaliação definidos
- [ ] Agente Técnico: objetivo, inputs, outputs e critérios de avaliação definidos
- [ ] Agente Financeiro: objetivo, inputs, outputs e critérios de avaliação definidos
- [ ] Orquestração entre agentes definida (sequencial, paralela ou híbrida)

---

### Fase 2 — Decisão baseada na auditoria

**Se 1 ou mais itens críticos estiverem ❌ Ausente** (especialmente 1.2 e 1.3):
- Liste os itens pendentes em ordem de prioridade
- Para cada pendência, sugira a ação corretiva com o prompt ou tarefa correspondente
- Não avance para a Fase 3
- Encerre com: *"Resolva os itens acima antes de prosseguir com os agentes."*

**Se todos os itens estiverem ✅ Completo ou 🚧 Parcial aceitável:**
- Registre o resultado da auditoria em `docs/checklist-prontidao.md`
- Avance para a Fase 3

---

### Fase 3 — Planejamento dos Agentes (somente se Fase 2 liberar)

Para cada agente abaixo, produza um plano detalhado no formato especificado:

#### Template de plano por agente

```markdown


## Implementar serviço OpenAI centralizado e integrar os três agentes

### Contexto
Consulte os seguintes artefatos antes de qualquer ação:
- `../plan-validadorIdeiaNegocio.prompt.md` — plano geral do projeto
- `docs/api/openapi.yaml` — contrato da API e schemas de resposta dos agentes
- `src/agents/` — implementação atual dos agentes (Mercado, Técnico, Financeiro)
- `.env.example` — variáveis de ambiente já declaradas no projeto
- `package.json` (ou equivalente) — dependências já instaladas

Extraia do plano geral e do código existente:
- Stack e linguagem do projeto (TypeScript, Python, etc.)
- SDK de LLM já adicionado (OpenAI SDK, LangChain, Vercel AI SDK, etc.)
- Modelos definidos para cada agente
- Formato de resposta esperado por agente (schemas do `openapi.yaml`)

---

### Fase 1 — Auditoria pré-implementação

Antes de escrever qualquer código, verifique e classifique como
✅ Presente | ⚠️ Incompleto | ❌ Ausente:

- [ ] SDK da OpenAI instalado nas dependências
- [ ] Variável `OPENAI_API_KEY` declarada no `.env.example`
- [ ] Pasta `src/services/` (ou equivalente) existe na estrutura
- [ ] Tipos/interfaces dos inputs e outputs dos agentes definidos
- [ ] Schemas de resposta JSON de cada agente documentados

Se qualquer item estiver ❌ Ausente, liste as ações corretivas e
interrompa antes de gerar código.

---

### Fase 2 — Implementar o serviço OpenAI centralizado

Crie o arquivo `src/services/openai.service.ts`
(adapte a extensão à linguagem do projeto).

O serviço deve expor uma função central com a seguinte assinatura:

```typescript
async function callOpenAI(params: OpenAICallParams): Promise<OpenAICallResult>
```

#### 2.1 Timeout
- Implemente timeout configurável via variável de ambiente:
  `OPENAI_TIMEOUT_MS` (padrão: `30000`)
- Use `AbortController` + `signal` na chamada nativa,
  ou o mecanismo equivalente do SDK em uso
- Lance erro tipado em caso de timeout:
  `OpenAITimeoutError` com mensagem descritiva

#### 2.2 Retry com backoff exponencial
- Implemente no máximo `OPENAI_MAX_RETRIES` tentativas (padrão: `3`)
- Aplique backoff exponencial com jitter:
  `delay = (2^tentativa × 1000ms) + jitter aleatório (0–500ms)`
- Faça retry **somente** nos seguintes casos:
  - HTTP 429 (rate limit)
  - HTTP 500, 502, 503, 504 (erros transientes do servidor)
  - Timeout da requisição
- **Não** faça retry em erros permanentes:
  - HTTP 400 (bad request), 401 (auth), 403 (forbidden), 404
- Registre cada tentativa em log com: número da tentativa, erro recebido,
  delay aplicado

#### 2.3 Parse robusto de JSON
- Extraia o JSON da resposta do modelo com resiliência a variações comuns:
  - Resposta com markdown fences (` ```json ... ``` `)
  - Espaços e quebras de linha extras antes/depois do JSON
  - JSON embutido em texto explicativo do modelo
- Implemente a extração em camadas:
  1. Tentativa de `JSON.parse()` direto
  2. Extração via regex: `/```json\s*([\s\S]*?)```/` ou `/\{[\s\S]*\}/`
  3. Se ambas falharem, lance `OpenAIParseError` com o conteúdo bruto
     para diagnóstico
- Valide o JSON parsed contra o schema esperado (Zod, Pydantic ou equivalente)
  antes de retornar

#### 2.4 Tipagem e contratos internos

```typescript
interface OpenAICallParams {
  systemPrompt: string        // prompt do sistema do agente
  userMessage: string         // input do usuário
  model: string               // ex: "gpt-4o", "gpt-4o-mini"
  responseSchema: ZodSchema   // schema de validação do retorno
  temperature?: number        // padrão: 0.3 para agentes analíticos
  maxTokens?: number          // padrão: definido por agente
  agentName: string           // para identificação nos logs e erros
}

interface OpenAICallResult<T> {
  data: T                     // resposta parseada e validada
  usage: {                    // consumo de tokens para monitoramento
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  attemptCount: number        // quantas tentativas foram necessárias
  latencyMs: number           // tempo total da chamada
}
```

#### 2.5 Observabilidade
- Registre em log estruturado (JSON) para cada chamada:
```json
  {
    "agentName": "mercado",
    "model": "gpt-4o-mini",
    "attemptCount": 2,
    "latencyMs": 4200,
    "promptTokens": 850,
    "completionTokens": 312,
    "success": true,
    "error": null
  }
```
- Use `console.log` estruturado como fallback mínimo se não houver
  biblioteca de log configurada no projeto

---

### Fase 3 — Integrar os três agentes ao serviço

Para cada agente (`Mercado`, `Técnico`, `Financeiro`), refatore sua
implementação atual para:

1. **Remover** qualquer chamada direta ao SDK da OpenAI
2. **Importar e usar** exclusivamente `callOpenAI` do serviço centralizado
3. **Passar** o schema de validação Zod (ou equivalente) específico do agente
4. **Propagar** erros tipados (`OpenAITimeoutError`, `OpenAIParseError`,
   `OpenAIValidationError`) sem capturá-los no agente —
   a camada de controller é responsável pelo tratamento final
5. **Manter** o prompt do sistema encapsulado dentro do próprio agente —
   o serviço é agnóstico ao domínio

Estrutura de arquivos resultante esperada:
src/
├── services/
│   └── openai.service.ts       ← serviço centralizado (novo)
├── agents/
│   ├── mercado/
│   │   ├── index.ts            ← refatorado para usar o serviço
│   │   ├── prompt.ts           ← prompt do sistema isolado
│   │   └── schema.ts           ← schema Zod de validação da resposta
│   ├── tecnico/
│   │   ├── index.ts
│   │   ├── prompt.ts
│   │   └── schema.ts
│   └── financeiro/
│       ├── index.ts
│       ├── prompt.ts
│       └── schema.ts
└── errors/
└── openai.errors.ts        ← classes de erro tipadas (novo)

---

### Fase 4 — Variáveis de ambiente necessárias

Adicione ao `.env.example` as seguintes variáveis, com comentário explicativo:

```dotenv
# —— OpenAI ——————————————————————————————————————————————
# Obrigatório | Obtida em: https://platform.openai.com/api-keys
OPENAI_API_KEY=

# Modelo padrão para os agentes analíticos (Mercado, Técnico, Financeiro)
# Sugerido: gpt-4o-mini (custo-benefício) ou gpt-4o (maior qualidade)
OPENAI_MODEL=gpt-4o-mini

# Timeout por chamada em milissegundos (padrão: 30000)
OPENAI_TIMEOUT_MS=30000

# Número máximo de tentativas em caso de erro transiente (padrão: 3)
OPENAI_MAX_RETRIES=3
```

---

### Fase 5 — O que requer ação manual obrigatória

Liste explicitamente ao final tudo que **não pode ser automatizado**:

| # | Ação manual                          | Onde                                      | Quando               |
|---|--------------------------------------|-------------------------------------------|----------------------|
| 1 | Criar conta e obter `OPENAI_API_KEY` | platform.openai.com/api-keys              | Antes de rodar       |
| 2 | Adicionar créditos na conta OpenAI   | platform.openai.com/settings/billing      | Antes de rodar       |
| 3 | Copiar `.env.example` para `.env`    | Raiz do projeto                           | Antes de rodar       |
| 4 | Preencher `OPENAI_API_KEY` no `.env` | Arquivo `.env` local                      | Antes de rodar       |
| 5 | Confirmar modelo disponível na conta | platform.openai.com/settings/limits       | Se usar gpt-4o       |
| 6 | Configurar limites de gasto (budget) | platform.openai.com/settings/limits       | Recomendado          |
| 7 | Adicionar `.env` ao `.gitignore`     | `.gitignore` na raiz                      | Antes do primeiro commit |

---

### Fase 6 — Testes mínimos do serviço

Crie testes unitários em `src/services/openai.service.test.ts` cobrindo:

- [ ] Chamada bem-sucedida retorna dados parseados e `usage`
- [ ] Timeout dispara `OpenAITimeoutError` após `OPENAI_TIMEOUT_MS`
- [ ] HTTP 429 aciona retry com backoff; sucesso na 2ª tentativa
- [ ] HTTP 401 não aciona retry e lança erro imediatamente
- [ ] Resposta com markdown fences é parseada corretamente
- [ ] JSON inválido lança `OpenAIParseError` com conteúdo bruto
- [ ] Schema inválido lança `OpenAIValidationError` com detalhes do campo

Use mocks do SDK — nenhum teste deve fazer chamada real à API.

---

### Restrições
- O serviço deve ser **completamente agnóstico** ao domínio dos agentes
- Nenhum agente deve importar o SDK da OpenAI diretamente após a refatoração
- Não hardcode model, timeout ou retries — todas via variável de ambiente
  com fallback para valor padrão
- Não exponha a `OPENAI_API_KEY` em logs, erros ou respostas da API
- Não crie chamadas reais à OpenAI nos testes unitários

### Saída esperada
Ao final de cada fase, informe:
- Arquivos criados ou modificados com seus caminhos
- Variáveis de ambiente adicionadas ao `.env.example`
- Itens pendentes de ação manual (tabela da Fase 5)
- Testes criados e o que cada um cobre