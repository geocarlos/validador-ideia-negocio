import React from 'react';
import useHistory from '../../hooks/useHistory';
import ValidationCard from './ValidationCard';
import FilterBar from './FilterBar';
import Pagination from './Pagination';

export default function HistoryList() {
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
            onDelete={() => refresh()}
          />
        ))}
      </div>

      <Pagination page={page} pageSize={pageSize} total={total} onChangePage={(p) => setPage(p)} />

      <div className="mt-3 text-sm text-gray-600">Total: {total}</div>
    </div>
  );
}
