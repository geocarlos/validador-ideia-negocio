# Feature: Implementar serviço OpenAI centralizado

**Data:** 2026-05-22
**Versão:** 1.0
**Categoria:** backend / infra
**Objetivo:** Implementar `src/services/openai.service` que encapsule chamadas ao SDK da OpenAI com timeout, retry/backoff, parsing robusto e validação de schema.

## Descrição

Criar um serviço centralizado com função `callOpenAI(params)` que oferece:
- Timeout configurável via `OPENAI_TIMEOUT_MS`
- Retry exponencial com jitter controlado por `OPENAI_MAX_RETRIES`
- Parsing resiliente de JSON (handles fences, texto extra)
- Validação do resultado com Zod
- Logs estruturados de observabilidade e consumo de tokens

## Prompt Original

```
Implemente callOpenAI com timeout, retries (429/5xx), parse robusto e validação contra Zod schema.
```

## Resultado Esperado

- `src/services/openai.service.js` criado
- Erros tipados: `OpenAITimeoutError`, `OpenAIParseError`, `OpenAIValidationError`
- Testes unitários cobrindo timeout, retry e parsing

## Status

❌ Pendente — template criado.
