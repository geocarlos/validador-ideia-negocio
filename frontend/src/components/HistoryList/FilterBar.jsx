import React from 'react';

export default function FilterBar({ query, from, to, onQuery, onFrom, onTo, onClear }) {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:items-end md:gap-4 mb-4">
      <div className="flex-1">
        <label className="block text-sm text-gray-600">Buscar</label>
        <input
          type="text"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Pesquisar por texto"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">De</label>
        <input
          type="date"
          value={from}
          onChange={(e) => onFrom(e.target.value)}
          className="mt-1 p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Até</label>
        <input
          type="date"
          value={to}
          onChange={(e) => onTo(e.target.value)}
          className="mt-1 p-2 border rounded"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClear}
          className="mt-4 px-3 py-2 bg-gray-100 rounded text-sm"
        >
          Limpar
        </button>
      </div>
    </div>
  );
}
