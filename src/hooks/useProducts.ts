// ─────────────────────────────────────────────────────────────────────────────
// src/hooks/useProducts.ts
// React hooks that wrap the service layer with loading/error state.
// Pages use hooks, not raw service functions, so loading state is handled once.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useCallback } from 'react';
import {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
} from '@/services/products';
import type { Product, ProductFilters } from '@/types';

// ── useProducts — filtered product list ──────────────────────────────────────

export function useProducts(filters: Partial<ProductFilters> = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Serialize filters to detect changes safely in the dependency array
  const filtersKey = JSON.stringify(filters);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(JSON.parse(filtersKey));
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [filtersKey]);

  useEffect(() => { load(); }, [load]);

  return { products, loading, error, refetch: load };
}

// ── useFeaturedProducts — home page featured grid ───────────────────────────

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFeaturedProducts()
      .then(setProducts)
      .catch(err =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}

// ── useProduct — single product by slug ──────────────────────────────────────

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProductBySlug(slug)
      .then(setProduct)
      .catch(err =>
        setError(err instanceof Error ? err.message : 'Product not found')
      )
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}