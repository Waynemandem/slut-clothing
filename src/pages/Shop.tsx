// src/pages/Shop.tsx
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, JSX } from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";
import { ActiveFilterPill } from "@/components/ActiveFilterPill";
import { useShopFilters } from "@/hooks/useShopFilters";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import type { ProductFilters, SortOption } from "@/types";

const SORT_LABELS: Record<SortOption, string> = {
  newest:     "Newest",
  price_asc:  "Price: Low → High",
  price_desc: "Price: High → Low",
  name_asc:   "Name: A → Z",
};

const DEFAULT_FILTERS: ProductFilters = {
  category: null,
  minPrice: null,
  maxPrice: null,
  inStockOnly: false,
  sort: "newest",
  search: "",
};

export default function Shop(): JSX.Element {
  // ── State & Hooks ────────────────────────────────────────────────────────
  const [filterOpen, setFilterOpen] = useState(false);
  const { filters, handleFilterChange, clearFilters } = useShopFilters();
  const [tempFilters, setTempFilters] = useState(filters);

  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      handleFilterChange({ search: debouncedSearch });
    }
  }, [debouncedSearch, handleFilterChange, filters.search]);
  
  useEffect(() => {
    if (filterOpen) {
      setTempFilters(filters);
    }
  }, [filterOpen, filters]);

  const { products, loading: productsLoading } = useProducts(filters);
  const { categories } = useCategories();

  const applyTempFilters = () => {
    handleFilterChange(tempFilters);
    setFilterOpen(false);
  };

  const clearTempFilters = () => {
    setTempFilters(DEFAULT_FILTERS);
  };

  // ── Derived values ────────────────────────────────────────────────────────
  const activeFilterCount = Object.values(filters).filter(value => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value && value !== 'newest';
    return value !== null;
  }).length - (filters.search ? 1 : 0) + (debouncedSearch ? 1 : 0);

  const pageTitle = filters.category ?? "All Products";
  const isLoading = productsLoading;

  return (
    <div className="min-h-screen bg-white">
      {/* ... (rest of the component is the same until the Sheet) ... */}
      {/* ── Search + mobile filter bar ───────────────────────────────────── */}
      <div className="border-b border-neutral-100 px-6 md:px-10 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">
          {/* ... (Search input is the same) ... */}
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="pl-8 pr-8 h-9 rounded-none border-neutral-200 text-xs focus-visible:ring-0 focus-visible:border-black"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Mobile filter button */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden rounded-none border-neutral-200 h-9 text-xs tracking-widest uppercase gap-2">
                <SlidersHorizontal size={13} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-6 flex flex-col">
              <SheetHeader className="mb-6 p-0">
                <SheetTitle className="text-xs font-bold tracking-[0.2em] uppercase text-left">Filter & Sort</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto">
                <FilterSidebar
                  filters={tempFilters}
                  categories={categories}
                  onChange={setTempFilters}
                  onClear={clearTempFilters}
                  resultCount={products.length}
                />
              </div>
              <SheetFooter className="pt-6">
                <Button onClick={applyTempFilters} className="w-full rounded-none">Apply</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Result count */}
          {!isLoading && (
            <span className="text-xs text-neutral-400 ml-auto hidden sm:block">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          )}
        </div>
      </div>
      
      {/* ... (rest of the component is the same) ... */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-10">
        <div className="flex gap-10">
          {/* Desktop filter sidebar */}
          <div className="hidden md:block w-48 flex-shrink-0">
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
            {/* Active filter pills */}
            {activeFilterCount > 0 && (
              <div className="hidden md:flex flex-wrap gap-2 mb-6">
                {filters.category && <ActiveFilterPill label={filters.category} onRemove={() => handleFilterChange({ category: null })} />}
                {(filters.minPrice !== null || filters.maxPrice !== null) && (
                  <ActiveFilterPill
                    label={
                      filters.minPrice && filters.maxPrice ? `$${filters.minPrice} – $${filters.maxPrice}`
                      : filters.minPrice ? `Over $${filters.minPrice}`
                      : `Under $${filters.maxPrice}`
                    }
                    onRemove={() => handleFilterChange({ minPrice: null, maxPrice: null })}
                  />
                )}
                {filters.inStockOnly && <ActiveFilterPill label="In Stock" onRemove={() => handleFilterChange({ inStockOnly: false })} />}
                {filters.sort !== "newest" && <ActiveFilterPill label={SORT_LABELS[filters.sort]} onRemove={() => handleFilterChange({ sort: "newest" })} />}
              </div>
            )}
            <ProductGrid
              products={products}
              isLoading={isLoading}
              skeletonCount={8}
              emptyTitle={activeFilterCount > 0 ? "No products match your filters" : "No products yet"}
              emptyMessage={activeFilterCount > 0 ? "Try adjusting your filters or clearing them to see all products." : "Check back soon for new arrivals."}
              emptyAction={
                activeFilterCount > 0 ? (
                  <Button onClick={clearFilters} variant="outline" className="rounded-none border-black text-xs tracking-widest uppercase">
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

