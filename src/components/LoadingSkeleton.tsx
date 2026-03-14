// src/components/LoadingSkeleton.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Renders n placeholder product cards while data is being fetched.
// Uses shadcn's Skeleton component so the shimmer animation matches the design.
//
// Usage:
//   <LoadingSkeleton count={4} />
//   <LoadingSkeleton count={8} columns={4} />
// ─────────────────────────────────────────────────────────────────────────────

import { Skeleton } from "./ui/skeleton";

interface LoadingSkeletonProps {
  /** Number of skeleton cards to show (default: 4) */
  count?: number;
}

export default function LoadingSkeleton({ count = 4 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
}

// ── SkeletonCard ──────────────────────────────────────────────────────────────
// A single skeleton card that exactly mirrors the shape of ProductCard.
// The proportions (aspect-[3/4], text widths) must match ProductCard so the
// layout doesn't shift when real content loads — this is called CLS prevention.
function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      {/* Image placeholder — matches aspect-[3/4] from ProductCard */}
      <Skeleton className="w-full aspect-[3/4] rounded-none bg-neutral-100" />

      {/* Category label */}
      <Skeleton className="h-2.5 w-16 rounded-none bg-neutral-100" />

      {/* Product name */}
      <Skeleton className="h-3.5 w-3/4 rounded-none bg-neutral-100" />

      {/* Price */}
      <Skeleton className="h-3 w-1/4 rounded-none bg-neutral-100" />
    </div>
  );
}