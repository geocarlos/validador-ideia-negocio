# Feature: Testes mínimos para o serviço OpenAI

**Data:** 2026-05-22
**Versão:** 1.0
**Categoria:** tests
**Objetivo:** Criar uma suíte de testes unitários para `openai.service` cobrindo parsing, timeout e retry.

## Descrição

Usar mocks do SDK para validar comportamentos:
- sucesso com parsing e `usage`
- timeout aciona `OpenAITimeoutError`
- 429 aciona retry com backoff
- 401 não é retried
- parsing de fences funciona

## Prompt Original

```
Crie testes unitários sem chamadas reais à OpenAI para cobrir timeout, retry, parse e validação.
```

## Resultado Esperado

- `src/services/openai.service.test.js` com mocks do SDK
- Cobertura dos casos listados

## Status

❌ Pendente — template criado.
