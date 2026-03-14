// src/pages/Shop.tsx
// ─────────────────────────────────────────────────────────────────────────────
// The main Shop page.
//
// FEATURES:
//   - URL-synced filters: ?category=Hoodies&sort=price_asc persists on refresh
//     and enables sharing filtered URLs.
//   - Category filter, price range filter, in-stock toggle, sort dropdown.
//   - Live search (client-side, instant).
//   - Mobile filter panel via shadcn Sheet.
//   - Responsive grid: 2 cols mobile → 3 cols tablet → 4 cols desktop.
//   - All data from Supabase via productService functions.
//
// LAYOUT:
//   Desktop: [FilterSidebar | ProductGrid] (sidebar is sticky)
//   Mobile:  [SearchBar + Filter button row] then [ProductGrid full width]
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import ProductGrid from "../components/ProductGrid";
import FilterSidebar from "../components/FilterSidebar";
import { fetchProducts, fetchCategories } from "../services/productService";
import type { Product, ProductFilters, SortOption } from "../types";

// ── Default filter state ───────────────────────────────────────────────────────
const DEFAULT_FILTERS: ProductFilters = {
  category: null,
  minPrice: null,
  maxPrice: null,
  inStockOnly: false,
  sort: "newest",
  search: "",
};

const SORT_LABELS: Record<SortOption, string> = {
  newest:     "Newest",
  price_asc:  "Price: Low → High",
  price_desc: "Price: High → Low",
  name_asc:   "Name: A → Z",
};

export default function Shop() {
  // ── State ────────────────────────────────────────────────────────────────
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]     = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filterOpen, setFilterOpen] = useState(false); // mobile filter sheet

  // ── Filters from URL (so filters survive refresh and can be shared) ───────
  const filters: ProductFilters = {
    category:    searchParams.get("category"),
    minPrice:    searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null,
    maxPrice:    searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null,
    inStockOnly: searchParams.get("inStock") === "true",
    sort:        (searchParams.get("sort") as SortOption) || "newest",
    search:      searchParams.get("search") || "",
  };

  // ── Update URL when a filter changes ──────────────────────────────────────
  const handleFilterChange = useCallback(
    (updated: Partial<ProductFilters>) => {
      const next = { ...filters, ...updated };
      const params: Record<string, string> = {};

      if (next.category)    params.category  = next.category;
      if (next.minPrice)    params.minPrice  = String(next.minPrice);
      if (next.maxPrice)    params.maxPrice  = String(next.maxPrice);
      if (next.inStockOnly) params.inStock   = "true";
      if (next.sort && next.sort !== "newest") params.sort = next.sort;
      if (next.search)      params.search    = next.search;

      setSearchParams(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  );

  const clearFilters = () => setSearchParams({});

  // ── Fetch categories once on mount ────────────────────────────────────────
  useEffect(() => {
    fetchCategories().then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  // ── Fetch products whenever filters change ────────────────────────────────
  useEffect(() => {
    setLoading(true);
    fetchProducts(filters).then(({ data }) => {
      setProducts(data ?? []);
      setLoading(false);
    });
    // Stringify filters for stable dependency comparison
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // ── Derived values ────────────────────────────────────────────────────────
  const activeFilterCount = [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.inStockOnly,
    filters.sort !== "newest" ? filters.sort : null,
  ].filter(Boolean).length;

  const pageTitle = filters.category ?? "All Products";

  return (
    <div className="min-h-screen bg-white">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="border-b border-neutral-100 pt-28 pb-8 px-6 md:px-10">
        <div className="max-w-screen-xl mx-auto">
          <p className="text-xs text-neutral-400 tracking-[0.3em] uppercase mb-2">
            {filters.category ? "Category" : "Browse"}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h1
              className="text-4xl md:text-5xl font-black leading-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}
            >
              {pageTitle}
            </h1>

            {/* Desktop sort dropdown */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-none border-neutral-200 text-xs tracking-widest uppercase h-9 min-w-[180px] justify-between"
                  >
                    {SORT_LABELS[filters.sort]}
                    <span className="ml-2 text-neutral-300">↕</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-none w-52">
                  {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([value, label]) => (
                    <DropdownMenuItem
                      key={value}
                      onClick={() => handleFilterChange({ sort: value })}
                      className={`text-xs tracking-wide cursor-pointer ${
                        filters.sort === value ? "font-semibold" : ""
                      }`}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + mobile filter bar ───────────────────────────────────── */}
      <div className="border-b border-neutral-100 px-6 md:px-10 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">

          {/* Search input */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <Input
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              placeholder="Search products..."
              className="pl-8 pr-8 h-9 rounded-none border-neutral-200 text-xs focus-visible:ring-0 focus-visible:border-black"
            />
            {filters.search && (
              <button
                onClick={() => handleFilterChange({ search: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Mobile filter button */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden rounded-none border-neutral-200 h-9 text-xs tracking-widest uppercase gap-2"
              >
                <SlidersHorizontal size={13} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-6">
              <SheetHeader className="mb-6 p-0">
                <SheetTitle className="text-xs font-bold tracking-[0.2em] uppercase text-left">
                  Filter & Sort
                </SheetTitle>
              </SheetHeader>
              <FilterSidebar
                filters={filters}
                categories={categories}
                onChange={(updated) => {
                  handleFilterChange(updated);
                  setFilterOpen(false);
                }}
                onClear={() => {
                  clearFilters();
                  setFilterOpen(false);
                }}
                resultCount={products.length}
              />
            </SheetContent>
          </Sheet>

          {/* Result count */}
          {!loading && (
            <span className="text-xs text-neutral-400 ml-auto hidden sm:block">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          )}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-10">
        <div className="flex gap-10">

          {/* Desktop filter sidebar — hidden on mobile */}
          <div className="hidden md:block w-48 flex-shrink-0">
            {/* sticky: sidebar stays in view while scrolling through products */}
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                categories={categories}
                onChange={handleFilterChange}
                onClear={clearFilters}
                resultCount={products.length}
              />
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1 min-w-0">

            {/* Active filter pills (desktop) */}
            {activeFilterCount > 0 && (
              <div className="hidden md:flex flex-wrap gap-2 mb-6">
                {filters.category && (
                  <ActiveFilterPill
                    label={filters.category}
                    onRemove={() => handleFilterChange({ category: null })}
                  />
                )}
                {(filters.minPrice !== null || filters.maxPrice !== null) && (
                  <ActiveFilterPill
                    label={
                      filters.minPrice && filters.maxPrice
                        ? `$${filters.minPrice}–$${filters.maxPrice}`
                        : filters.minPrice
                        ? `Over $${filters.minPrice}`
                        : `Under $${filters.maxPrice}`
                    }
                    onRemove={() =>
                      handleFilterChange({ minPrice: null, maxPrice: null })
                    }
                  />
                )}
                {filters.inStockOnly && (
                  <ActiveFilterPill
                    label="In Stock"
                    onRemove={() => handleFilterChange({ inStockOnly: false })}
                  />
                )}
                {filters.sort !== "newest" && (
                  <ActiveFilterPill
                    label={SORT_LABELS[filters.sort]}
                    onRemove={() => handleFilterChange({ sort: "newest" })}
                  />
                )}
              </div>
            )}

            <ProductGrid
              products={products}
              isLoading={loading}
              skeletonCount={8}
              emptyTitle={
                activeFilterCount > 0 ? "No products match your filters" : "No products yet"
              }
              emptyMessage={
                activeFilterCount > 0
                  ? "Try adjusting your filters or clearing them to see all products."
                  : "Check back soon for new arrivals."
              }
              emptyAction={
                activeFilterCount > 0 ? (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="rounded-none border-black text-xs tracking-widest uppercase"
                  >
                    Clear Filters
                  </Button>
                ) : undefined
              }
            />
          </div>
        </div>
      </div>

    </div>
  );
}

// ── ActiveFilterPill ──────────────────────────────────────────────────────────
// Small dismissible tag shown above the grid for active filters.
function ActiveFilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-1.5 bg-neutral-100 px-3 py-1.5 text-xs font-medium">
      <span>{label}</span>
      <button onClick={onRemove} className="text-neutral-400 hover:text-black transition-colors">
        <X size={11} />
      </button>
    </div>
  );
}