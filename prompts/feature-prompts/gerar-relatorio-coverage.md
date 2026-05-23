# Feature: Gerar relatório de coverage

**Data:** 2026-05-22
**Versão:** 1.0
**Categoria:** testing
**Objetivo:** Gerar e publicar relatório de cobertura (HTML/JSON) e identificar arquivos com baixa cobertura.

## Descrição

Passos esperados:
- Rodar `npx jest --coverage` e garantir `coverage/coverage-summary.json` gerado
- Publicar relatório HTML em `coverage/lcov-report/index.html`
- Extrair lista de arquivos com coverage menor que um threshold (ex.: 30%)
- Abrir issues/PRs para adicionar testes nos arquivos críticos

## Prompt Original

```
Generate a coverage report and list files below threshold; provide commands to reproduce locally and in CI.
```

## Resultado Esperado

- `coverage/coverage-summary.json` gerado (confirmado)
- Documento `prompts/feature-prompts/gerar-relatorio-coverage.md` (este arquivo)
- Lista inicial de arquivos com baixa cobertura e comandos para CI

## Status

✅ Gerado — coverage atual já disponível.
