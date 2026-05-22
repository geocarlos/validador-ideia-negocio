import React from 'react';

function range(start, end) {
  const r = [];
  for (let i = start; i <= end; i++) r.push(i);
  return r;
}

export default function Pagination({ page, pageSize, total, onChangePage }) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
  const show = 5;
  const half = Math.floor(show / 2);
  let start = Math.max(1, page - half);
  let end = Math.min(totalPages, start + show - 1);
  if (end - start < show - 1) start = Math.max(1, end - show + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onChangePage(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {range(start, end).map((p) => (
        <button
          key={p}
          onClick={() => onChangePage(p)}
          className={`px-3 py-1 border rounded ${p === page ? 'bg-indigo-500 text-white' : ''}`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChangePage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
