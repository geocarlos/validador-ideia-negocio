import { useState, useEffect, useRef, useCallback } from 'react';
import validationService from '../services/validationService';

export default function useHistory({ initialPage = 1, initialPageSize = 10 } = {}) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  const fetchPage = useCallback(
    async (opts = {}) => {
      setLoading(true);
      setError(null);

      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await validationService.fetchHistory({
          page: opts.page ?? page,
          pageSize: opts.pageSize ?? pageSize,
          query: opts.query ?? query,
          signal: controller.signal,
        });

        setItems(res.items || []);
        setTotal(typeof res.total === 'number' ? res.total : 0);
        setPage(res.page || page);
        setPageSize(res.pageSize || pageSize);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err);
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [page, pageSize, query]
  );

  useEffect(() => {
    fetchPage();
  }, [page, pageSize, fetchPage]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchPage({ page: 1, query });
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query, fetchPage]);

  const setFilters = useCallback((next) => {
    if (next.query !== undefined) setQuery(next.query);
    setPage(1);
  }, []);

  const refresh = useCallback(() => fetchPage({ page }), [fetchPage, page]);

  return {
    items,
    page,
    pageSize,
    total,
    query,
    loading,
    error,
    setPage,
    setPageSize,
    setQuery,
    setFilters,
    refresh,
  };
}
