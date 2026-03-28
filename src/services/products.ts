// src/services/productService.ts
// ─────────────────────────────────────────────────────────────────────────────
// All Supabase queries related to products live here.
//
// ARCHITECTURE RULE:
//   Pages call these functions. Components receive data as props.
//   Nothing outside this file should import `supabase` directly for products.
//
// PATTERN:
//   Every function returns ServiceResult<T> = { data, error }.
//   The caller decides how to handle the error — service functions never throw.
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from "../lib/supabase";
import type { Product, ProductFilters, ServiceResult } from "../types";

// ── fetchFeaturedProducts ─────────────────────────────────────────────────────
/**
 * Fetches products marked is_featured = true, ordered by newest first.
 * Used by the Home page featured grid.
 *
 * @param limit - max number of products to return (default 4)
 */
export async function fetchFeaturedProducts(
  limit = 4
): Promise<ServiceResult<Product[]>> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return { data: null, error: error.message };
  return { data: data as Product[], error: null };
}

// ── fetchProducts ─────────────────────────────────────────────────────────────
/**
 * Fetches all products, with optional filtering and sorting.
 * Used by the Shop page.
 *
 * Filtering is done server-side via Supabase query builders where possible.
 * In-stock filtering and search are applied client-side after the query
 * because Supabase full-text search requires a separate setup.
 */
export async function fetchProducts(
  filters: Partial<ProductFilters> = {}
): Promise<ServiceResult<Product[]>> {
  const {
    category = null,
    minPrice = null,
    maxPrice = null,
    inStockOnly = false,
    sort = "newest",
    search = "",
  } = filters;

  // Start the query
  let query = supabase.from("products").select("*");

  // ── Server-side filters ──
  if (category) {
    query = query.eq("category", category);
  }
  if (minPrice !== null) {
    query = query.gte("price", minPrice);
  }
  if (maxPrice !== null) {
    query = query.lte("price", maxPrice);
  }

  // ── Sorting ──
  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "name_asc":
      query = query.order("name", { ascending: true });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) return { data: null, error: error.message };

  // ── Client-side filters (applied after query) ──
  let results = data as Product[];

  if (inStockOnly) {
    results = results.filter((p) => p.stock > 0);
  }

  if (search.trim()) {
    const term = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.description ?? "").toLowerCase().includes(term) ||
        (p.category ?? "").toLowerCase().includes(term)
    );
  }

  return { data: results, error: null };
}

// ── fetchProductById ──────────────────────────────────────────────────────────
/**
 * Fetches a single product by its UUID.
 * Used by the Product Detail page when navigating via /product/:id
 */
export async function fetchProductById(
  id: string
): Promise<ServiceResult<Product>> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as Product, error: null };
}

// ── fetchProductBySlug ────────────────────────────────────────────────────────
/**
 * Fetches a single product by its slug (human-readable URL key).
 * Used by the Product Detail page when navigating via /product/:slug
 * Requires a `slug` column in the products table.
 */
export async function fetchProductBySlug(
  slug: string
): Promise<ServiceResult<Product>> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as Product, error: null };
}

// ── fetchCategories ───────────────────────────────────────────────────────────
/**
 * Returns a deduplicated list of all product categories.
 * Used by the FilterSidebar to build the category filter buttons dynamically.
 * Results are sorted alphabetically.
 */
export async function fetchCategories(): Promise<ServiceResult<string[]>> {
  const { data, error } = await supabase
    .from("products")
    .select("category")
    .order("category", { ascending: true });

  if (error) return { data: null, error: error.message };

  // Deduplicate and strip nulls
  const unique = [
    ...new Set(
      (data as { category: string | null }[])
        .map((p) => p.category)
        .filter((c): c is string => c !== null)
    ),
  ];

  return { data: unique, error: null };
}

// ── fetchNewArrivals ──────────────────────────────────────────────────────────
/**
 * Fetches the most recently added products.
 * Used by the "New In" filter shortcut on the Shop page.
 */
export async function fetchNewArrivals(
  limit = 8
): Promise<ServiceResult<Product[]>> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_new", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return { data: null, error: error.message };
  return { data: data as Product[], error: null };
}

// ── Admin Functions ──────────────────────────────────────────────────────────

/** Admin only: insert a new product row. */
export async function createProduct(
  product: Omit<Product, 'id' | 'created_at'>
): Promise<ServiceResult<Product>> {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

/** Admin only: update a product row. */
export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, 'id' | 'created_at'>>
): Promise<ServiceResult<Product>> {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

/** Admin only: delete a product row. */
export async function deleteProduct(id: string): Promise<ServiceResult<null>> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return { data: null, error: error.message };
  return { data: null, error: null };
}
