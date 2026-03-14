// src/components/FilterSidebar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// The filter panel for the Shop page.
// On desktop: renders as a persistent left sidebar.
// On mobile: renders inside a Sheet (slide-in drawer) triggered by a button.
//
// All filter state lives in Shop.tsx and is passed down as props.
// This component is purely presentational — it calls onFilterChange when
// the user interacts, and the parent handles updating the state.
//
// Usage:
//   // Desktop
//   <FilterSidebar filters={filters} categories={categories} onChange={setFilters} />
//
//   // Mobile (inside a Sheet)
//   <Sheet>
//     <SheetContent>
//       <FilterSidebar filters={filters} categories={categories} onChange={setFilters} />
//     </SheetContent>
//   </Sheet>
// ─────────────────────────────────────────────────────────────────────────────

import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import type { ProductFilters, SortOption } from "../types";

// ── Types ─────────────────────────────────────────────────────────────────────
interface FilterSidebarProps {
  filters: ProductFilters;
  categories: string[];
  onChange: (updated: Partial<ProductFilters>) => void;
  /** Called when the user clicks "Clear All" */
  onClear: () => void;
  /** Total number of products currently visible — shown in the clear button label */
  resultCount?: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest",     label: "Newest"          },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "name_asc",   label: "Name: A → Z"      },
];

const PRICE_RANGES: { label: string; min: number | null; max: number | null }[] = [
  { label: "All prices", min: null,  max: null  },
  { label: "Under $50",  min: null,  max: 50    },
  { label: "$50 – $100", min: 50,    max: 100   },
  { label: "$100 – $150",min: 100,   max: 150   },
  { label: "Over $150",  min: 150,   max: null  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function FilterSidebar({
  filters,
  categories,
  onChange,
  onClear,
  resultCount,
}: FilterSidebarProps) {
  // Derived: check if any non-default filter is active so we can show "Clear All"
  const hasActiveFilters =
    filters.category !== null ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.inStockOnly ||
    filters.sort !== "newest";

  return (
    <aside className="space-y-8 text-sm">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-800">
          Filters
        </span>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-xs text-neutral-400 hover:text-black transition-colors underline underline-offset-2"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Sort ── */}
      <FilterSection title="Sort By">
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <FilterPill
              key={opt.value}
              label={opt.label}
              active={filters.sort === opt.value}
              onClick={() => onChange({ sort: opt.value })}
            />
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* ── Category ── */}
      <FilterSection title="Category">
        <div className="space-y-1">
          {/* "All" option */}
          <FilterPill
            label="All"
            active={filters.category === null}
            onClick={() => onChange({ category: null })}
          />
          {categories.map((cat) => (
            <FilterPill
              key={cat}
              label={cat}
              active={filters.category === cat}
              onClick={() => onChange({ category: cat })}
            />
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* ── Price range ── */}
      <FilterSection title="Price">
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const isActive =
              filters.minPrice === range.min && filters.maxPrice === range.max;
            return (
              <FilterPill
                key={range.label}
                label={range.label}
                active={isActive}
                onClick={() =>
                  onChange({ minPrice: range.min, maxPrice: range.max })
                }
              />
            );
          })}
        </div>
      </FilterSection>

      <Separator />

      {/* ── Availability ── */}
      <FilterSection title="Availability">
        {/* Custom toggle — not a checkbox so it matches the minimal aesthetic */}
        <button
          onClick={() => onChange({ inStockOnly: !filters.inStockOnly })}
          className="flex items-center gap-3 w-full group"
        >
          {/* Toggle track */}
          <div
            className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
              filters.inStockOnly ? "bg-black" : "bg-neutral-200"
            }`}
          >
            {/* Toggle thumb */}
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                filters.inStockOnly ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
          <span
            className={`text-xs transition-colors ${
              filters.inStockOnly ? "text-black font-medium" : "text-neutral-500"
            }`}
          >
            In stock only
          </span>
        </button>
      </FilterSection>

      {/* ── Result count (desktop only) ── */}
      {resultCount !== undefined && (
        <p className="text-xs text-neutral-400 pt-2">
          {resultCount} {resultCount === 1 ? "product" : "products"}
        </p>
      )}
    </aside>
  );
}

// ── FilterSection ─────────────────────────────────────────────────────────────
// Wraps a group of filter controls with a labelled heading.
function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-neutral-400">
        {title}
      </p>
      {children}
    </div>
  );
}

// ── FilterPill ────────────────────────────────────────────────────────────────
// A single selectable filter option.
// Active state: black background, white text.
// Inactive state: transparent with hover.
function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1.5 text-xs rounded-none transition-all duration-150 ${
        active
          ? "bg-black text-white font-semibold"
          : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
      }`}
    >
      {label}
    </button>
  );
}