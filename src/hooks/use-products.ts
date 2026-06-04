import { useQuery } from "@tanstack/react-query";
import { fetchProducts, ProductsParams } from "@/lib/api";
import { AllProducts } from "@/schemas/product";

export const productKeys = {
  all: ["response"] as const,
};

export function useProducts(params?: ProductsParams) {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: (): Promise<AllProducts> =>
      fetchProducts(
        params ?? {
          limit: 10,
          page: 1,
          select: "id,title,category,thumbnail,price",
        },
      ),
  });
}
