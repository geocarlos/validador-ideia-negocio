# DeleteConfirmModal

Modal controlado para confirmar exclusão de uma validação.

## Uso

```jsx
const { loading, error, deleteItem } = useDelete(`/validacoes/${id}`, {
  onSuccess: () => refresh(),
});

<DeleteConfirmModal
  isOpen={showModal}
  loading={loading}
  error={error}
  onConfirm={deleteItem}
  onCancel={() => setShowModal(false)}
/>
```

`useDelete` delega a `validationService.deleteValidation` (`DELETE /api/validacoes/:id`).

Documentação completa: [`docs/README.md`](../../../docs/README.md).
