# DeleteConfirmModal Component

## Descrição
Componente modal reutilizável para confirmação segura de deleção.

## Características
- ✅ Modal controlado (isOpen prop)
- ✅ Loading state durante operação
- ✅ Exibição de erros
- ✅ Acessível (ARIA)
- ✅ Customizável (title, message, textos)
- ✅ Responsive (mobile/desktop)

## Uso Básico

```javascript
import { useState } from 'react';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import useDelete from '../hooks/useDelete';

function MyComponent({ itemId }) {
  const [showModal, setShowModal] = useState(false);
  const { loading, error, deleteItem } = useDelete(`/api/items/${itemId}`);

  const handleDelete = async () => {
    try {
      await deleteItem();
      setShowModal(false);
      // Atualizar lista ou voltar
    } catch (err) {
      // Erro exibido no modal
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Deletar</button>

      <DeleteConfirmModal
        isOpen={showModal}
        loading={loading}
        error={error}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowModal(false);
          // Limpar erro se necessário
        }}
      />
    </>
  );
}
```

## Props

| Prop | Tipo | Obrigatório | Descrição |
|------|------|------------|-----------|
| `isOpen` | boolean | ✅ | Se modal está aberto |
| `title` | string | ❌ | Título do modal (default: "Confirmar Deleção") |
| `message` | string | ❌ | Mensagem (default: "Você tem certeza...") |
| `loading` | boolean | ❌ | Estado de loading |
| `error` | Error | ❌ | Erro se houver |
| `onConfirm` | function | ✅ | Callback ao confirmar |
| `onCancel` | function | ✅ | Callback ao cancelar |
| `confirmText` | string | ❌ | Texto botão (default: "Deletar") |
| `cancelText` | string | ❌ | Texto botão (default: "Cancelar") |

## Customização

### Mudar textos

```javascript
<DeleteConfirmModal
  isOpen={showModal}
  title="Remover Validação"
  message="Esta ação é permanente. Deseja continuar?"
  confirmText="Sim, Remover"
  cancelText="Não, Manter"
  onConfirm={handleDelete}
  onCancel={() => setShowModal(false)}
/>
```

### Cores customizadas

No arquivo `index.jsx`, mudar classes:
- `bg-red-100` → cor de fundo do ícone
- `text-red-600` → cor do ícone
- `bg-red-600` → cor botão confirmar

## Acessibilidade

- ✅ `role="dialog"` e `aria-modal="true"`
- ✅ `aria-labelledby` para título
- ✅ Backdrop pode ser clicado para fechar
- ✅ Botão close com aria-label
- ✅ Desabilita botões durante loading
- ✅ Suporta teclado (Escape para fechar)

## Layout

```
┌─────────────────────────────────┐
│ ⚠                           ✕   │
│                                 │
│   Confirmar Deleção             │
│                                 │
│   Você tem certeza que deseja   │
│   deletar? Esta ação não pode   │
│   ser desfeita.                 │
│                                 │
│ ┌──────────────┐ ┌───────────┐ │
│ │   Cancelar   │ │  Deletar  │ │
│ └──────────────┘ └───────────┘ │
└─────────────────────────────────┘
```

## Estados

### Aberto com Sucesso Pendente
```
[Modal com botões normais]
```

### Loading
```
[Botão de deleção com spinner + "Deletando..."]
[Botão cancelar desabilitado]
```

### Erro
```
[Exibe card de erro com mensagem]
[Botões ainda funcionam para tentar novamente ou fechar]
```

## Comportamento

1. **Abrir**: `setShowModal(true)`
2. **Confirmar**: Executa `onConfirm()`, exibe loading
3. **Sucesso**: Limpar e fechar modal
4. **Erro**: Exibir erro no modal, permitir tentar novamente
5. **Cancelar**: Executa `onCancel()`, fecha modal

## Integração com useDelete

```javascript
const { loading, error, deleteItem } = useDelete(endpoint, {
  onSuccess: () => {
    setShowModal(false);
    // Atualizar lista
  },
  onError: (err) => {
    // Erro já exibido no modal
  }
});

// No modal:
<DeleteConfirmModal
  loading={loading}
  error={error}
  onConfirm={deleteItem}
/>
```

## Responsividade

- **Mobile**: Stack vertical dos botões, padding menor
- **Desktop**: Botões lado a lado (flex-row)
- **Max-width**: 448px (sm breakpoint)

## Performance

- Renderização condicional (`if (!isOpen) return null`)
- Uso de callbacks para evitar re-renders desnecessários
- Sem efeitos colaterais
