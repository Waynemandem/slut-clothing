// src/types/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for all TypeScript types used across the project.
// Import from here in every component, page, and service file.
// ─────────────────────────────────────────────────────────────────────────────

// ── Product ──────────────────────────────────────────────────────────────────
// Mirrors the `products` table in Supabase exactly.
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  compare_price: number | null;   // original price — shown as strikethrough when set
  category: string | null;
  images: string[];               // images[0] = main, images[1] = hover swap
  sizes: string[];                // e.g. ["XS","S","M","L","XL"] or ["28","30","32"]
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  is_sale: boolean;
  created_at: string;
  slug?: string;                  // optional human-readable URL key
}

// ── Cart ─────────────────────────────────────────────────────────────────────
// A cart item is a product snapshot plus the chosen size and quantity.
// We store a snapshot (not just an ID) so the cart stays correct even if
// the product price changes after it was added.
export interface CartItem extends Pick<Product, "id" | "name" | "price" | "images" | "category"> {
  size: string;
  quantity: number;
}

// ── Order ────────────────────────────────────────────────────────────────────
// Mirrors the `orders` table in Supabase.
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered";

export interface ShippingAddress {
  name: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shipping_address: ShippingAddress | null;
  stripe_session_id: string | null;
  created_at: string;
}

// ── Filters ───────────────────────────────────────────────────────────────────
// Used by the Shop page and FilterSidebar to represent the current filter state.
export type SortOption = "newest" | "price_asc" | "price_desc" | "name_asc";

export interface ProductFilters {
  category: string | null;          // null = "All"
  minPrice: number | null;
  maxPrice: number | null;
  inStockOnly: boolean;
  sort: SortOption;
  search: string;
}

// ── Supabase service return shape ─────────────────────────────────────────────
// Consistent return type for all async service functions so callers always
// know what to expect — either data or an error string, never both.
export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

// ── App context ───────────────────────────────────────────────────────────────
// The shape of everything exposed by useApp().
// Used to type the context value and any component that destructures it.
export interface AppContextValue {
  user: import("@supabase/supabase-js").User | null;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
}

// ── UI helpers ────────────────────────────────────────────────────────────────
// Reusable prop shapes for common UI patterns.

/** Any component that conditionally shows a loading state */
export interface WithLoading {
  isLoading?: boolean;
}

/** Any component that can display an error */
export interface WithError {
  error?: string | null;
}