import { z } from "zod";
import { AllProductsSchema, AllProducts } from "@/schemas/product";

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

function buildQueryString(params: ProductsParams): string {
  const pairs: string[] = [];
  if (params.limit != null) pairs.push(`limit=${params.limit}`);
  if (params.page != null) pairs.push(`page=${params.page}`);
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

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${API_URL}/category-list`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return z.array(z.string()).parse(data);
}
