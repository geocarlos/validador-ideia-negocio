/**
 * Exemplos Avançados: useDelete Hook em Diferentes Contextos
 * 
 * Mostra como reutilizar o hook genérico em cenários diversos
 */

/**
 * Exemplo 1: Deleção Simples (sem modal)
 * 
 * Use quando não precisa de confirmação
 */
function DeleteButtonSimple({ itemId }) {
  const { loading, error, deleteItem } = useDelete(`/api/items/${itemId}`);

  return (
    <>
      <button
        onClick={deleteItem}
        disabled={loading}
        className="text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        {loading ? 'Deletando...' : 'Deletar'}
      </button>
      {error && <div className="text-red-600">{error.message}</div>}
    </>
  );
}

/**
 * Exemplo 2: Deleção com Modal Customizado
 * 
 * Use seu próprio modal ao invés de DeleteConfirmModal
 */
function DeleteWithCustomModal({ itemId, onSuccess }) {
  const [showModal, setShowModal] = useState(false);
  const { loading, error, deleteItem } = useDelete(`/api/items/${itemId}`, {
    onSuccess: () => {
      setShowModal(false);
      onSuccess?.();
    },
  });

  const handleConfirm = async () => {
    try {
      await deleteItem();
    } catch (err) {
      // Erro já está em state
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Deletar</button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <h2>Deletar Item?</h2>
            <p>Tem certeza?</p>
            {error && <p className="text-red-600">{error.message}</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowModal(false)}>Cancelar</button>
              <button onClick={handleConfirm} disabled={loading}>
                {loading ? 'Deletando...' : 'Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Exemplo 3: Deleção em Massa
 * 
 * Delete múltiplos itens com Promise.all
 */
function DeleteBulk({ selectedIds, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const deletePromises = selectedIds.map((id) => {
        const { deleteItem } = useDelete(`/api/items/${id}`);
        return deleteItem();
      });

      await Promise.all(deletePromises);
      onSuccess?.();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleDeleteAll} disabled={loading}>
        Deletar {selectedIds.length} itens
      </button>
      {error && <div className="text-red-600">{error.message}</div>}
    </>
  );
}

/**
 * Exemplo 4: Deleção com Retry
 * 
 * Permite tentar novamente após erro
 */
function DeleteWithRetry({ itemId }) {
  const [retryCount, setRetryCount] = useState(0);
  const { loading, error, deleteItem } = useDelete(`/api/items/${itemId}`, {
    onError: () => {
      if (retryCount < 3) {
        setRetryCount(retryCount + 1);
      }
    },
  });

  const handleDelete = async () => {
    try {
      await deleteItem();
      setRetryCount(0);
    } catch (err) {
      // Error state já atualizado
    }
  };

  return (
    <>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Deletando...' : 'Deletar'}
      </button>
      {error && (
        <div className="text-red-600">
          {error.message}
          {retryCount < 3 && (
            <button onClick={handleDelete} className="ml-2 text-blue-600">
              Tentar Novamente ({retryCount}/3)
            </button>
          )}
        </div>
      )}
    </>
  );
}

/**
 * Exemplo 5: Deleção com Toast Notification
 * 
 * Usa callbacks para exibir notificações
 */
function DeleteWithToast({ itemId }) {
  const { loading, error, deleteItem } = useDelete(`/api/items/${itemId}`, {
    onSuccess: () => {
      showToast('Item deletado com sucesso', 'success');
    },
    onError: (err) => {
      showToast(`Erro: ${err.message}`, 'error');
    },
  });

  return (
    <button
      onClick={deleteItem}
      disabled={loading}
      className="text-red-600 hover:text-red-800"
    >
      {loading ? 'Deletando...' : 'Deletar'}
    </button>
  );
}

/**
 * Exemplo 6: Deleção com Undo (Soft Delete)
 * 
 * Se backend suporta, permite reverter deleção
 */
function DeleteWithUndo({ itemId }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const { loading, deleteItem } = useDelete(`/api/items/${itemId}`);
  const { deleteItem: undoDelete } = useDelete(`/api/items/${itemId}/restore`);

  const handleDelete = async () => {
    await deleteItem();
    setIsDeleted(true);
    setTimeout(() => setIsDeleted(false), 5000); // Auto-dismiss
  };

  return (
    <>
      {!isDeleted ? (
        <button onClick={handleDelete} disabled={loading}>
          {loading ? 'Deletando...' : 'Deletar'}
        </button>
      ) : (
        <div className="bg-yellow-50 p-3 rounded flex items-center gap-2">
          <span>Item deletado</span>
          <button
            onClick={undoDelete}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Desfazer
          </button>
        </div>
      )}
    </>
  );
}

/**
 * Exemplo 7: Deleção com Validação
 * 
 * Valida antes de deletar
 */
function DeleteWithValidation({ item, allowedStatus = ['PENDING'] }) {
  const [error, setError] = useState(null);
  const { deleteItem, loading } = useDelete(`/api/items/${item.id}`, {
    onError: (err) => setError(err),
  });

  const handleDelete = async () => {
    // Validar
    if (!allowedStatus.includes(item.status)) {
      setError(
        new Error(`Não pode deletar item com status: ${item.status}`)
      );
      return;
    }

    await deleteItem();
  };

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={loading || !allowedStatus.includes(item.status)}
      >
        {loading ? 'Deletando...' : 'Deletar'}
      </button>
      {error && <div className="text-red-600">{error.message}</div>}
    </>
  );
}

/**
 * Exemplo 8: Deleção com Fetch Paralelo
 * 
 * Delete itens relacionados em paralelo
 */
function DeleteWithRelated({ itemId, relatedIds = [] }) {
  const [loading, setLoading] = useState(false);
  const { deleteItem } = useDelete(`/api/items/${itemId}`);

  const handleDeleteAll = async () => {
    setLoading(true);

    try {
      // Delete principal + relacionados em paralelo
      await Promise.all([
        deleteItem(),
        ...relatedIds.map((id) =>
          fetch(`/api/items/${id}`, { method: 'DELETE' })
        ),
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleDeleteAll} disabled={loading}>
      {loading ? 'Deletando...' : `Deletar ${1 + relatedIds.length} itens`}
    </button>
  );
}

/**
 * Exemplo 9: Deleção em Contexto (useContext)
 * 
 * Para operações globais de deleção
 */
function DeleteContext() {
  const [deletingId, setDeletingId] = useState(null);

  const deleteFromContext = async (itemId) => {
    setDeletingId(itemId);
    const { deleteItem } = useDelete(`/api/items/${itemId}`, {
      onSuccess: () => setDeletingId(null),
      onError: () => setDeletingId(null),
    });

    await deleteItem();
  };

  return {
    deletingId,
    deleteFromContext,
  };
}

/**
 * Exemplo 10: Custom Hook para Padrão Específico
 * 
 * Wrapper do useDelete para seu domínio específico
 */
function useValidationDelete(validationId, onSuccess) {
  const { loading, error, deleteItem } = useDelete(
    `/validacoes/${validationId}`,
    { onSuccess }
  );

  return {
    isDeleting: loading,
    deleteError: error,
    deleteValidation: deleteItem,
  };
}

// Uso do custom hook:
function DeleteValidationButton({ validationId }) {
  const { isDeleting, deleteError, deleteValidation } = useValidationDelete(
    validationId,
    () => {
      // Atualizar lista ou navegar
    }
  );

  return (
    <button onClick={deleteValidation} disabled={isDeleting}>
      {isDeleting ? 'Deletando...' : 'Deletar Validação'}
    </button>
  );
}

/**
 * Comparação de Padrões
 * 
 * Simples:          useDelete(endpoint)
 * Com Modal:        useDelete + DeleteConfirmModal
 * Com Callbacks:    useDelete(endpoint, { onSuccess, onError })
 * Com Retry:        useDelete + useState para retry count
 * Com Toast:        useDelete + showToast em callbacks
 * Com Undo:         useDelete + UI estado
 * Bulk:             Promise.all([...useDelete])
 * Validação:        Verificar antes de deleteItem()
 * Custom:           Wrapper do useDelete para domínio
 */

export {
  DeleteButtonSimple,
  DeleteWithCustomModal,
  DeleteBulk,
  DeleteWithRetry,
  DeleteWithToast,
  DeleteWithUndo,
  DeleteWithValidation,
  DeleteWithRelated,
  DeleteContext,
  useValidationDelete,
  DeleteValidationButton,
};
