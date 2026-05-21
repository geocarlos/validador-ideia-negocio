/**
 * Exemplo completo: HistoryList com feature de deleção
 * 
 * Mostra como a deleção é integrada automaticamente na HistoryList
 * Inclui:
 * - ValidationCard com botão de deleção
 * - DeleteConfirmModal para confirmação
 * - Atualização automática da lista após sucesso
 */

import React from 'react';
import useHistory from '../../hooks/useHistory';
import ValidationCard from './ValidationCard';
import FilterBar from './FilterBar';
import Pagination from './Pagination';

/**
 * HistoryList com deleção integrada
 * 
 * O fluxo é:
 * 1. User clica botão de lixo em ValidationCard
 * 2. Modal de confirmação abre
 * 3. User confirma deleção
 * 4. DELETE /api/validacoes/:id é executado
 * 5. Modal fecha automaticamente
 * 6. refresh() é chamado
 * 7. Lista é recarregada com os dados atualizados
 */
export default function HistoryListWithDelete() {
  const {
    items,
    page,
    pageSize,
    total,
    loading,
    error,
    query,
    from,
    to,
    setPage,
    setPageSize,
    setQuery,
    setFrom,
    setTo,
    setFilters,
    refresh,
  } = useHistory({ initialPage: 1, initialPageSize: 10 });

  // Callback quando item é deletado
  const handleItemDeleted = (deletedId) => {
    // refresh() já é chamado em ValidationCard.onDelete
    // mas você pode adicionar lógica customizada aqui se necessário
    console.log('Item deletado:', deletedId);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Histórico de validações</h2>

      <FilterBar
        query={query}
        from={from}
        to={to}
        onQuery={setQuery}
        onFrom={setFrom}
        onTo={setTo}
        onClear={() => setFilters({ query: '', from: '', to: '' })}
      />

      {loading && <div className="p-4">Carregando...</div>}
      {error && (
        <div className="p-4 text-red-600">Erro ao carregar: {error.message}</div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="p-4 text-gray-600">Nenhuma validação encontrada.</div>
      )}

      <div className="grid gap-3">
        {items.map((v) => (
          <ValidationCard 
            key={v.id || v._id || JSON.stringify(v)} 
            validation={v}
            onDelete={() => handleItemDeleted(v.id)}
          />
        ))}
      </div>

      <Pagination 
        page={page} 
        pageSize={pageSize} 
        total={total} 
        onChangePage={(p) => setPage(p)} 
      />

      <div className="mt-3 text-sm text-gray-600">Total: {total}</div>
    </div>
  );
}

/**
 * Fluxo de deleção:
 * 
 * ┌─────────────────────────────────────────────┐
 * │ HistoryList                                 │
 * │                                             │
 * │ ValidationCard (item 1)                     │
 * │ ┌──────────────────────────────────────┐   │
 * │ │ Título                         [🗑]  │   │
 * │ │ Descrição...                         │   │
 * │ │ 21/05/2026 14:30                     │   │
 * │ └──────────────────────────────────────┘   │
 * │                                             │
 * │ ValidationCard (item 2)                     │
 * │ ┌──────────────────────────────────────┐   │
 * │ │ Título                         [🗑]  │   │
 * │ │ Descrição...                         │   │
 * │ │ 21/05/2026 14:30                     │   │
 * │ └──────────────────────────────────────┘   │
 * └─────────────────────────────────────────────┘
 *          ↓ (click no ícone de lixo)
 * ┌─────────────────────────────────────────────┐
 * │        ┌──────────────────────────────┐     │
 * │        │    ⚠ Confirmar Deleção      │     │
 * │        │                              │     │
 * │        │ Você tem certeza que deseja  │     │
 * │        │ deletar? Esta ação não pode  │     │
 * │        │ ser desfeita.                │     │
 * │        │                              │     │
 * │        │  [Cancelar]  [Deletar]       │     │
 * │        └──────────────────────────────┘     │
 * └─────────────────────────────────────────────┘
 *     ↓ (click em "Deletar")
 * DELETE /api/validacoes/:id
 *     ↓ (sucesso)
 * Modal fecha
 * refresh() é chamado
 * Lista é atualizada
 *     ↓
 * ┌─────────────────────────────────────────────┐
 * │ HistoryList                                 │
 * │                                             │
 * │ ValidationCard (item 2) - item 1 foi deletado
 * │ ┌──────────────────────────────────────┐   │
 * │ │ Título                         [🗑]  │   │
 * │ │ Descrição...                         │   │
 * │ │ 21/05/2026 14:30                     │   │
 * │ └──────────────────────────────────────┘   │
 * └─────────────────────────────────────────────┘
 */
