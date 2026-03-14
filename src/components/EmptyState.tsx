// src/components/EmptyState.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Shown when a query returns 0 results — either no products in the database,
// or no products matching the current filters.
//
// Usage:
//   <EmptyState />
//   <EmptyState
//     icon={<SearchX size={40} />}
//     title="No results found"
//     message="Try adjusting your filters or search term."
//     action={<Button onClick={clearFilters}>Clear Filters</Button>}
//   />
// ─────────────────────────────────────────────────────────────────────────────

import { PackageSearch } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  /** Icon element to show — defaults to a bag/search icon */
  icon?: ReactNode;
  /** Main heading text */
  title?: string;
  /** Supporting paragraph text */
  message?: string;
  /** Optional CTA button or any action element */
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  title = "No products found",
  message = "Try adjusting your filters or check back later for new arrivals.",
  action,
}: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 px-6 text-center">
      {/* Icon */}
      <div className="text-neutral-300 mb-5">
        {icon ?? <PackageSearch size={44} strokeWidth={1} />}
      </div>

      {/* Heading */}
      <h3 className="text-base font-semibold tracking-wide text-neutral-700 mb-2">
        {title}
      </h3>

      {/* Supporting text */}
      <p className="text-sm text-neutral-400 max-w-xs leading-relaxed mb-6">
        {message}
      </p>

      {/* Action (e.g. "Clear Filters" button) */}
      {action && <div>{action}</div>}
    </div>
  );
}