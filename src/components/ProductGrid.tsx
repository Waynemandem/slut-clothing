// src/components/ProductGrid.tsx
// ─────────────────────────────────────────────────────────────────────────────
// The single grid container for displaying products.
// Manages all three states: loading, empty, and populated.
//
// This keeps Shop.tsx and Home.jsx clean — they just pass products and let
// ProductGrid handle the state logic and layout.
//
// Usage:
//   <ProductGrid products={products} isLoading={loading} />
//   <ProductGrid products={[]} isLoading={false} emptyAction={<Button>...</Button>} />
// ─────────────────────────────────────────────────────────────────────────────

import ProductCard from "./ProductCard";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";
import type { Product } from "../types";
import { ReactNode } from "react";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  /** Number of skeleton cards to show while loading (default: 8) */
  skeletonCount?: number;
  /** Optional action element passed to EmptyState (e.g. a "Clear Filters" button) */
  emptyAction?: ReactNode;
  /** Custom empty state title */
  emptyTitle?: string;
  /** Custom empty state message */
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 8,
  emptyAction,
  emptyTitle,
  emptyMessage,
}: ProductGridProps) {
  return (
    /*
      Grid layout:
      - 2 columns on mobile (default for fashion shops — larger images, easier tap targets)
      - 3 columns on md (768px+)
      - 4 columns on xl (1280px+)

      gap-x is slightly tighter than gap-y to mimic editorial magazine layouts
      where the white space below a card belongs to the caption, not the gutter.
    */
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">

      {/* ── Loading state ── */}
      {isLoading && <LoadingSkeleton count={skeletonCount} />}

      {/* ── Empty state ── */}
      {!isLoading && products.length === 0 && (
        <EmptyState
          title={emptyTitle}
          message={emptyMessage}
          action={emptyAction}
        />
      )}

      {/* ── Product cards ── */}
      {!isLoading &&
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

    </div>
  );
}