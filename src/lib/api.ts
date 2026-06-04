import { AllProductsSchema, AllProducts, Product } from "@/schemas/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export type ProductsParams = {
  limit?: number | 10;
  page?: number | 1;
  sortBy?: keyof Product;
  order?: "asc" | "desc";
  select?: string;
};

export async function fetchProducts(
  params: ProductsParams,
): Promise<AllProducts> {
  const searchParams = new URLSearchParams(
    `limit=${params.limit}&page=${params.page}${params.sortBy ? `&sortBy=${params.sortBy}` : ""}${params.order ? `&order=${params.order}` : ""}${params.select ? `&select=${params.select}` : ""}`,
  );
  const res = await fetch(`${API_URL}?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return AllProductsSchema.parse(data);
}
