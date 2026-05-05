/**
 * API helpers — RouteМisr Ecommerce API
 * Base URL: https://ecommerce.routemisr.com/api/v1
 *
 * Confirmed working query params on GET /products:
 *   limit  → number of results per page
 *   page   → page number
 *
 * NOTE: keyword, category[in], category filtering params do NOT work on this API.
 * Search and category filtering are handled client-side after fetching all products.
 *
 * Other endpoints:
 *   GET  /products/:id   → single product
 *   GET  /categories     → all categories
 *   POST /auth/signin    → { email, password } → { token, user }
 *   POST /auth/signup    → { name, email, password, rePassword, phone } → { token, user }
 */

import { Product, Category, PaginatedResponse } from "@/types/product";

const BASE = process.env.NEXT_PUBLIC_API_URL!;

/** Fetch ALL products (all pages merged) for client-side filtering */
export async function getAllProducts(): Promise<Product[]> {
  // Fetch first page to get total page count
  const first = await fetch(`${BASE}/products?limit=40&page=1`, {
    next: { revalidate: 60 },
  });
  if (!first.ok) throw new Error("Failed to fetch products");

  const firstData: PaginatedResponse<Product> = await first.json();
  const { numberOfPages } = firstData.metadata;

  if (numberOfPages <= 1) return firstData.data;

  // Fetch remaining pages in parallel
  const rest = await Promise.all(
    Array.from({ length: numberOfPages - 1 }, (_, i) =>
      fetch(`${BASE}/products?limit=40&page=${i + 2}`, {
        next: { revalidate: 60 },
      }).then((r) => r.json() as Promise<PaginatedResponse<Product>>)
    )
  );

  return [firstData, ...rest].flatMap((r) => r.data);
}

/** Fetch a single product by id */
export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
  const json: { data: Product } = await res.json();
  return json.data;
}

/** Fetch all categories (long cache — rarely changes) */
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE}/categories`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  const json: PaginatedResponse<Category> = await res.json();
  return json.data;
}
