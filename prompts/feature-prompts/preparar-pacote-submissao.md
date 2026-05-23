# Feature: Preparar pacote de submissão

**Data:** 2026-05-22
**Versão:** 1.0
**Categoria:** release / docs
**Objetivo:** Empacotar artefatos finais do projeto em um pacote de submissão (zip/release) contendo documentação, migrations e builds.

## Descrição

Criar um processo e checklist para gerar um pacote de submissão que inclua:
- `README.md` atualizado com instruções de execução e pré-requisitos
- `docs/` com OpenAPI (`api/openapi.yaml`), UML e prompts relevantes
- `backend/prisma/migrations/` e `prisma/schema.prisma`
- Build do `frontend/` (produção) ou instruções claras para gerar o build
- Scripts para exportar banco de dados de desenvolvimento, se aplicável
- Checklist de verificação (licenças, segredos removidos, variáveis de ambiente documentadas)

## Prompt Original

```
Prepare a submission package: list artifacts to include, scripts to build and pack, and checklist to validate.
```

## Resultado Esperado

- Documento `prompts/feature-prompts/preparar-pacote-submissao.md` (este arquivo)
- Scripts opcionais ou instruções para gerar `package.zip` ou release
- Checklist claro para validar conteúdos da submissão

## Status

❌ Pendente — template criado.
