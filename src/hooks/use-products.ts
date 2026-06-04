import { useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchCategories,
  fetchProductById,
  ProductsParams,
} from "@/lib/api";
import { AllProducts, Product } from "@/schemas/product";

const DEFAULTS: ProductsParams = {
  limit: 10,
  page: 1,
  select: "id,title,category,thumbnail,price",
};

export function useProducts(params?: ProductsParams) {
  const merged = { ...DEFAULTS, ...params };

  return useQuery({
    queryKey: ["products", merged],
    queryFn: (): Promise<AllProducts> => fetchProducts(merged),
  });
}

export function useProduct(id: number | null) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: (): Promise<Product> => fetchProductById(id!),
    enabled: id != null,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
}
