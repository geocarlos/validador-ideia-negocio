import React from 'react';

export default function ValidationCard({ validation }) {
  const date = validation.createdAt || validation.date || validation.created_at;
  const title = validation.idea || validation.input || validation.title || 'Validação';
  const summary = validation.summary || validation.result || validation.outcome || null;

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="font-semibold text-gray-900">{title}</div>
          {summary && (
            <div className="text-sm text-gray-700 mt-1">{typeof summary === 'string' ? summary : JSON.stringify(summary)}</div>
          )}
        </div>
        <div className="text-xs text-gray-500">{date ? new Date(date).toLocaleString() : ''}</div>
      </div>
    </div>
  );
}
