"use client";

/**
 * Filters — client component.
 * Manages search input (debounced 400ms) and category pills.
 * Updates URL search params → triggers page re-render with filtered results.
 */

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Category } from "@/types/product";

interface FiltersProps {
  categories: Category[];
  totalResults: number;
}

const DEBOUNCE_MS = 400;

export default function Filters({ categories, totalResults }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Mirror URL keyword into local input state
  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    // Reset to page 1 on any filter change
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Debounce keyword → URL update
  const handleKeyword = (value: string) => {
    setKeyword(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      pushParams({ keyword: value });
    }, DEBOUNCE_MS);
  };

  // Category is instant
  const handleCategory = (id: string) => pushParams({ category: id });

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const selectedCategory = searchParams.get("category") ?? "";

  return (
    <div className="space-y-4">
      {/* Search + count */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => handleKeyword(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
          />
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {totalResults} product{totalResults !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategory("")}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
            selectedCategory === ""
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCategory(cat._id)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
              selectedCategory === cat._id
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
