import { useState, useEffect, useCallback, useRef } from 'react';

export function useInfiniteScroll(items, pageSize = 10) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const visible = items.slice(0, page * pageSize);
  const hasMore = visible.length < items.length;

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    setLoading(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setLoading(false);
    }, 400);
  }, [hasMore, loading]);

  useEffect(() => {
    setPage(1);
  }, [items.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  return { visible, hasMore, loading, sentinelRef, reset: () => setPage(1) };
}
