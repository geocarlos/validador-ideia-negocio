/**
 * DeleteConfirmModal - Modal de confirmação para deleção
 * 
 * Responsabilidades:
 * - Exibir modal com confirmação
 * - Gerenciar estado de loading
 * - Exibir mensagens de erro
 * - Callbacks para confirmar/cancelar
 * - Acessível e seguro
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Se modal está visível
 * @param {string} [props.title] - Título do modal
 * @param {string} [props.message] - Mensagem de confirmação
 * @param {boolean} [props.loading] - Estado de loading
 * @param {Error} [props.error] - Erro se houver
 * @param {function} props.onConfirm - Callback ao confirmar deleção
 * @param {function} props.onCancel - Callback ao cancelar
 * @param {string} [props.confirmText] - Texto do botão confirmar
 * @param {string} [props.cancelText] - Texto do botão cancelar
 * @returns {JSX.Element}
 */

import React from 'react';

const DeleteConfirmModal = ({
  isOpen,
  title = 'Confirmar Deleção',
  message = 'Você tem certeza que deseja deletar? Esta ação não pode ser desfeita.',
  loading = false,
  error = null,
  onConfirm,
  onCancel,
  confirmText = 'Deletar',
  cancelText = 'Cancelar',
}) => {
  // Se modal não está aberto, não renderizar nada
  if (!isOpen) {
    return null;
  }

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (err) {
      // Erro já é capturado no hook, modal continua aberto
      console.error('Erro ao deletar:', err);
    }
  };

  return (
    <>
      {/* Backdrop (overlay) */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full px-4 py-12">
          <div
            className="relative bg-white rounded-lg shadow-xl max-w-sm w-full transform transition-all"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Close button no canto */}
            <button
              onClick={onCancel}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
              aria-label="Fechar"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Conteúdo */}
            <div className="px-6 py-6">
              {/* Ícone de aviso */}
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Título */}
              <h3 id="modal-title" className="mt-4 text-lg font-bold text-gray-900 text-center">
                {title}
              </h3>

              {/* Mensagem */}
              <p className="mt-2 text-sm text-gray-600 text-center">{message}</p>

              {/* Erro se houver */}
              {error && (
                <div className="mt-4 rounded-md bg-red-50 p-3 border border-red-200">
                  <p className="text-sm text-red-700">{error.message || 'Erro ao deletar'}</p>
                </div>
              )}

              {/* Botões */}
              <div className="mt-6 flex gap-3 sm:gap-2 flex-col-reverse sm:flex-row">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 
                             rounded-md hover:bg-gray-50 transition disabled:opacity-50 
                             disabled:cursor-not-allowed font-medium text-sm"
                >
                  {cancelText}
                </button>

                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 px-4 py-2 text-white bg-red-600 rounded-md 
                             hover:bg-red-700 transition disabled:opacity-50 
                             disabled:cursor-not-allowed font-medium text-sm 
                             inline-flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Deletando...
                    </>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmModal;
