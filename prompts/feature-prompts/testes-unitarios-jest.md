# Feature: Testes unitários Jest para módulos faltantes

**Data:** 2026-05-22
**Versão:** 1.0
**Categoria:** testing
**Objetivo:** Escrever testes unitários Jest para módulos com pouca/nenhuma cobertura e garantir robustez nas funções expostas.

## Descrição

Prioridades de implementação:
- `backend/src/app.js` — teste de inicialização e middlewares registrados
- `backend/src/routes/index.js` — teste de roteamento básico
- `backend/src/services/openai.service.js` — testes de parsing, timeout, e retry (usar mocks)
- `backend/src/services/validationService.js` — testes integrados com orquestrador mockado

## Prompt Original

```
Add Jest unit tests for missing modules and ensure mocking for external services (OpenAI, DB).
```

## Resultado Esperado

- Testes adicionados em `backend/tests/` cobrindo os módulos listados
- Mocks para OpenAI e Prisma/DB em `backend/tests/setup/`

## Status

❌ Pendente — template criado.
