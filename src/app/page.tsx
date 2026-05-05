/**
 * Home page — Server Component.
 *
 * Architecture:
 * - Server fetches ALL products once (cached 60s via Next.js fetch cache)
 * - URL params (keyword, category) are used to filter the list server-side
 *   before rendering — no extra API calls needed
 * - URL param (page) handles pagination of the filtered results
 * - <Filters> (client) debounces keyword and pushes URL params
 *
 * NOTE: The RouteМisr API does not support keyword/category query params —
 * confirmed by testing. Filtering is done on the full product list here.
 */

import { Suspense } from "react";
import { getAllProducts, getCategories } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";

interface PageProps {
  searchParams: Promise<{
    keyword?: string;
    category?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 12;

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const keyword = params.keyword?.trim().toLowerCase() ?? "";
  const category = params.category ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  // Fetch all products + categories in parallel (both are cached)
  const [allProducts, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  // Filter server-side before rendering
  const filtered = allProducts.filter((p) => {
    const matchesKeyword = keyword === "" || p.title.toLowerCase().includes(keyword);
    const matchesCategory = category === "" || p.category?._id === category;
    return matchesKeyword && matchesCategory;
  });

  // Paginate
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Filters — client component, needs Suspense for useSearchParams */}
      <Suspense fallback={null}>
        <Filters categories={categories} totalResults={filtered.length} />
      </Suspense>

      {/* Grid */}
      {paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
          <p className="text-base font-medium">No products found</p>
          <p className="text-sm">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginated.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Suspense fallback={null}>
        <Pagination currentPage={safePage} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
