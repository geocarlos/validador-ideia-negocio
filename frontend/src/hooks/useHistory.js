import { useState, useEffect, useRef, useCallback } from 'react';
import validationService from '../services/validationService';

export default function useHistory({ initialPage = 1, initialPageSize = 10 } = {}) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  const fetchPage = useCallback(async (opts = {}) => {
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
        from: opts.from ?? from,
        to: opts.to ?? to,
        signal: controller.signal,
      });

      // Expecting response shape: { items: [], total, page, pageSize }
      setItems(res.items || res.data || []);
      setTotal(typeof res.total === 'number' ? res.total : (res.count ?? 0));
      setPage(res.page || res.currentPage || page);
      setPageSize(res.pageSize || res.limit || pageSize);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [page, pageSize, query, from, to]);

  // Effect: refetch when page/pageSize change
  useEffect(() => {
    fetchPage();
  }, [page, pageSize, fetchPage]);

  // Debounced search effect
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
    if (next.from !== undefined) setFrom(next.from);
    if (next.to !== undefined) setTo(next.to);
    setPage(1);
  }, []);

  const refresh = useCallback(() => fetchPage({ page }), [fetchPage, page]);

  return {
    items,
    page,
    pageSize,
    total,
    query,
    from,
    to,
    loading,
    error,
    setPage,
    setPageSize,
    setQuery,
    setFrom,
    setTo,
    setFilters,
    refresh,
  };
}
