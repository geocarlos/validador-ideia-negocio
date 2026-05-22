# Feature: Criar branch e contrato da API REST

**Data:** 2026-05-22
**Versão:** 1.0
**Categoria:** docs / api
**Objetivo:** Gerar o contrato OpenAPI 3.1 para os endpoints especificados no plano geral e criar o branch apropriado.

## Descrição

Extrair do plano geral os endpoints e gerar um contrato OpenAPI 3.1 (YAML ou JSON) com schemas de request/response, exemplos e componentes reutilizáveis.

## Prompt Original

```
Crie o branch a partir de `develop` e gere o contrato da API REST em OpenAPI 3.1.

Para cada endpoint do plano, documente método, rota, payloads, respostas e exemplos.
```

## Resultado Esperado

- Arquivo `docs/api/openapi.yaml` criado (ou indicado caminho alternativo)
- Schemas em `components/schemas`
- Commit com mensagem: `docs: contrato OpenAPI da API REST conforme plano geral`

## Status

❌ Pendente — template criado.
