# Feature: Revisão de segurança e hardening

**Data:** 2026-05-22
**Versão:** 1.0
**Categoria:** security
**Objetivo:** Fazer uma auditoria de segurança rápida e aplicar hardening nas partes críticas (auth, env, dependências).

## Descrição

Checklist mínimo:
- `npm audit` e atualização de dependências críticas
- Revisão de tratamento de segredos e variáveis de ambiente (`.env`, `README`)
- Garantir uso de `helmet`, CORS restrito e sanitização de entradas
- Revisão de tokens JWT: expiração curta, rotação de chaves (documentação)
- Verificar endpoints expostos e mensagens de erro (não vazar stack traces)

## Prompt Original

```
Perform a quick security audit: dependency vulnerabilities, env handling, JWT settings, and recommended fixes.
```

## Resultado Esperado

- Documento `prompts/feature-prompts/revisao-seguranca.md` (este arquivo)
- Lista de alterações e PRs para hardening

## Status

❌ Pendente — template criado.
