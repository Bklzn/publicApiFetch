import { z } from "zod";
import {
  AllProductsSchema,
  AllProducts,
  ProductSchema,
  Product,
} from "@/schemas/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export type SortByField = "title" | "category" | "price";

export type ProductsParams = {
  limit?: number;
  page?: number;
  sortBy?: SortByField;
  order?: "asc" | "desc";
  select?: string;
  q?: string;
  category?: string;
};

const VALID_LIMITS = [10, 25, 50] as const;
export type Limit = (typeof VALID_LIMITS)[number];
export { VALID_LIMITS };

export function parsePage(raw: string | null, fallback: number): number {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : fallback;
}

export function parseLimit(raw: string | null, fallback: Limit): Limit {
  const n = Number(raw);
  return (VALID_LIMITS as readonly number[]).includes(n)
    ? (n as Limit)
    : fallback;
}

function buildQueryString(params: ProductsParams): string {
  const pairs: string[] = [];
  if (params.limit != null) pairs.push(`limit=${params.limit}`);
  const skip =
    params.page != null ? (params.page - 1) * (params.limit ?? 10) : 0;
  if (skip > 0) pairs.push(`skip=${skip}`);
  if (params.select) pairs.push(`select=${params.select}`);
  if (params.sortBy) pairs.push(`sortBy=${params.sortBy}`);
  if (params.order) pairs.push(`order=${params.order}`);
  return pairs.join("&");
}

export async function fetchProducts(
  params: ProductsParams,
): Promise<AllProducts> {
  const qs = buildQueryString(params);

  let url: string;
  if (params.q) {
    url = `${API_URL}/search?q=${params.q}&${qs}`;
  } else if (params.category) {
    url = `${API_URL}/category/${params.category}?${qs}`;
  } else {
    url = `${API_URL}?${qs}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return AllProductsSchema.parse(data);
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  const data = await res.json();
  return ProductSchema.parse(data);
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${API_URL}/category-list`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return z.array(z.string()).parse(data);
}
