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