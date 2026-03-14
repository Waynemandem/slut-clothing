// ─────────────────────────────────────────────────────────────────────────────
// src/services/products.ts
// All Supabase queries for products live here.
// Pages import these functions — they never write raw Supabase queries themselves.
// This keeps database logic in one place, making it easy to change or mock.
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';
import type { Product, ProductFilters } from '@/types';

/** Fetch all products, with optional filters and sorting. */
export async function getProducts(
  filters: Partial<ProductFilters> = {}
): Promise<Product[]> {
  let query = supabase.from('products').select('*');

  if (filters.category && filters.category !== 'All') {
    query = query.eq('category', filters.category);
  }
  if (filters.inStock) {
    query = query.gt('stock', 0);
  }
  if (filters.onSale) {
    query = query.eq('is_sale', true);
  }

  switch (filters.sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('price', { ascending: false });
      break;
    case 'featured':
      query = query.eq('is_featured', true);
      break;
    default:
      // newest
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Fetch up to 4 featured products for the Home page. */
export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Fetch a single product by its URL slug. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw new Error(error.message);
  }
  return data;
}

/** Fetch a single product by its UUID (used in admin / cart reconciliation). */
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data;
}

/** Admin only: insert a new product row. */
export async function createProduct(
  product: Omit<Product, 'id' | 'created_at'>
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Admin only: update a product row. */
export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, 'id' | 'created_at'>>
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Admin only: delete a product row. */
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
}