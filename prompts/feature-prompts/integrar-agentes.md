# Feature: Integrar os três agentes ao serviço OpenAI centralizado

**Data:** 2026-05-22
**Versão:** 1.0
**Categoria:** backend / agents
**Objetivo:** Refatorar agentes (`mercado`, `tecnico`, `financeiro`) para usar `callOpenAI` do serviço central e padronizar prompts e schemas.

## Descrição

Para cada agente:
- Remover chamadas diretas ao SDK
- Consumir `callOpenAI` com `systemPrompt`, `responseSchema`, `agentName`
- Isolar `prompt` e `schema` em arquivos do agente
- Propagar erros tipados para a camada superior

## Prompt Original

```
Refatore os agentes para usar o serviço OpenAI centralizado e passe schemas Zod.
```

## Resultado Esperado

- `src/agents/*/index.js` atualizados
- `src/agents/*/prompt.js` e `schema.js` mantidos/ajustados
- Integração com `orchestrator` sem exposição direta ao SDK

## Status

❌ Pendente — template criado.
