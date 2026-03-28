import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";
import type { ProductFilters, SortOption } from "@/types";

const DEFAULT_FILTERS: Readonly<ProductFilters> = {
  category: null,
  minPrice: null,
  maxPrice: null,
  inStockOnly: false,
  sort: "newest",
  search: "",
};

export function useShopFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ProductFilters = {
    category:    searchParams.get("category"),
    minPrice:    searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null,
    maxPrice:    searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null,
    inStockOnly: searchParams.get("inStock") === "true",
    sort:        (searchParams.get("sort") as SortOption) || "newest",
    search:      searchParams.get("search") || "",
  };

  const handleFilterChange = useCallback(
    (updated: Partial<ProductFilters>) => {
      const currentParams = new URLSearchParams(searchParams);
      
      // Merge updates with current state from URL
      const next = { ...filters, ...updated };

      // Reset keys that are cleared
      for (const key in updated) {
        if (updated[key as keyof ProductFilters] === null || updated[key as keyof ProductFilters] === '') {
          currentParams.delete(key === 'inStockOnly' ? 'inStock' : key);
        }
      }

      // Set new values
      if (next.category)    currentParams.set("category", next.category);
      else currentParams.delete("category");

      if (next.minPrice)    currentParams.set("minPrice", String(next.minPrice));
      else currentParams.delete("minPrice");
      
      if (next.maxPrice)    currentParams.set("maxPrice", String(next.maxPrice));
      else currentParams.delete("maxPrice");

      if (next.inStockOnly) currentParams.set("inStock", "true");
      else currentParams.delete("inStock");

      if (next.sort && next.sort !== "newest") currentParams.set("sort", next.sort);
      else currentParams.delete("sort");

      if (next.search)      currentParams.set("search", next.search);
      else currentParams.delete("search");

      setSearchParams(currentParams, { replace: true });
    },
    [searchParams, setSearchParams, filters]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return { filters, handleFilterChange, clearFilters, DEFAULT_FILTERS };
}
