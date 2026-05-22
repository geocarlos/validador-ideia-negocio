# ValidationDetail

Exibe o detalhe de uma validação (`GET /api/validacoes/:id`).

## Uso

```jsx
import ValidationDetail from './components/ValidationDetail';

<ValidationDetail id={validationId} />
```

Rota em produção: `/validations/:id` (ver `App.jsx`).

## Dependências

- `useValidationDetail` → `validationService.getValidationDetail`
- `AnalysisDashboard` para exibir `consolidado` (mercado, técnico, financeiro)

Documentação completa: [`docs/README.md`](../../../docs/README.md).
