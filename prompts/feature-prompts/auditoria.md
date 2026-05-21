Analise a pasta do backend e compare com a implementação atual do frontend.

Primeiro, faça um mapeamento completo da API do backend.
Depois compare com o frontend.
Só então gere o relatório.

# Objetivo

Validar se o frontend na pasta /frontend está totalmente compatível com a API da pasta /backend existente.

# Sua tarefa

Faça uma auditoria completa entre frontend e backend.

# Verifique:

## 1. Endpoints

- Todos os endpoints existentes no backend possuem integração no frontend?
- Existem endpoints usados no frontend que não existem no backend?
- URLs estão corretas?
- Métodos HTTP estão corretos?
- Rotas protegidas usam JWT corretamente?

## 2. Contratos

Compare:

- payload enviado
- payload esperado
- estrutura do JSON
- nomes dos campos
- tipos dos dados
- status HTTP

Identifique incompatibilidades.

## 3. Autenticação

Verifique:

- armazenamento do token
- envio do Authorization Bearer Token
- proteção de rotas
- persistência de sessão
- tratamento de 401

## 4. Hooks e Services

Verifique:

- separação correta de responsabilidades
- services desacoplados
- hooks encapsulando regras
- ausência de chamadas HTTP em componentes

## 5. Tratamento de erro

Verifique:

- loading states
- tratamento de exceptions
- mensagens amigáveis
- fallbacks de UI

## 6. Estrutura

Avalie:

- organização de pastas
- reutilização
- duplicação de lógica
- componentização
- escalabilidade

# Formato da resposta

## Compatível

Liste tudo que está correto.

## Problemas encontrados

Para cada problema:

- arquivo
- linha aproximada
- descrição
- impacto
- como corrigir

## Melhorias sugeridas

Liste melhorias arquiteturais.

## Pendências

Liste endpoints/backend features ainda não integradas no frontend.

# Importante

- Não invente endpoints
- Baseie-se apenas no código existente
- Seja rigoroso na comparação
- Gere exemplos de correção quando necessário
