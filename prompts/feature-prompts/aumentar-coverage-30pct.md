# Feature: Aumentar cobertura para >=30%

**Data:** 2026-05-22
**Versão:** 1.0
**Categoria:** testing
**Objetivo:** Atingir cobertura mínima de 30% adicionando testes para componentes críticos sem cobertura.

## Descrição

Ações sugeridas:
- Priorizar testes para arquivos sem cobertura de funções: `backend/src/app.js`, `backend/src/routes/index.js`
- Adicionar testes para `openai.service` falhas/timeout/parse
- Escrever testes integrados para `validationService` e orquestrador simulando respostas de agentes
- Atualizar CI para falhar se coverage global ficar abaixo de 30%

## Prompt Original

```
Write tests to increase coverage to at least 30% and add CI check.
```

## Resultado Esperado

- Arquivos de teste adicionados e cobertura >=30%
- PR(s) com os testes e ajuste de CI

## Status

❌ Pendente — template criado.
