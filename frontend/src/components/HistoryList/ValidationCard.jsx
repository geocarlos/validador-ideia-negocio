import React, { useState } from 'react';
import DeleteConfirmModal from '../DeleteConfirmModal';
import useDelete from '../../hooks/useDelete';

export default function ValidationCard({ validation, onDelete }) {
  const date = validation.createdAt || validation.date || validation.created_at;
  const title = validation.idea || validation.input || validation.title || 'Validação';
  const summary = validation.summary || validation.result || validation.outcome || null;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { loading: deleteLoading, error: deleteError, deleteItem } = useDelete(
    `/validacoes/${validation.id}`,
    {
      onSuccess: () => {
        setShowDeleteModal(false);
        onDelete?.(validation.id);
      },
    }
  );

  const handleDeleteConfirm = async () => {
    await deleteItem();
  };

  return (
    <>
      <div className="p-4 border rounded shadow-sm bg-white hover:shadow-md transition">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">{title}</div>
            {summary && (
              <div className="text-sm text-gray-700 mt-1 line-clamp-2">
                {typeof summary === 'string' ? summary : JSON.stringify(summary)}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-3 flex-shrink-0">
            <div className="text-xs text-gray-500 whitespace-nowrap">
              {date ? new Date(date).toLocaleString() : ''}
            </div>

            {/* Botão de deleção */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-red-600 hover:bg-red-50 rounded transition"
              aria-label="Deletar validação"
              title="Deletar validação"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmação de deleção */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Deletar Validação"
        message="Você tem certeza que deseja deletar esta validação? Esta ação não pode ser desfeita."
        loading={deleteLoading}
        error={deleteError}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Deletar"
        cancelText="Cancelar"
      />
    </>
  );
}
