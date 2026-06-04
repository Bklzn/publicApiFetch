"use client";

import { Suspense, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Container, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { useProducts, useCategories } from "@/hooks/use-products";
import { FilterBar } from "@/components/FilterBar";
import { LimitSelect } from "@/components/LimitSelect";
import { PaginationBar } from "@/components/PaginationBar";
import {
  parsePage,
  parseLimit,
  type ProductsParams,
  type Limit,
} from "@/lib/api";
import { ProductItem } from "@/components/ProductItem";

const DEFAULT_PARAMS: ProductsParams = {
  limit: 10,
  page: 1,
  select: "id,title,category,thumbnail,price",
};

function parseParams(sp: URLSearchParams | null): ProductsParams {
  const p: ProductsParams = { ...DEFAULT_PARAMS };
  const q = sp?.get("q");
  const category = sp?.get("category");
  const sortBy = sp?.get("sortBy");
  const order = sp?.get("order");
  if (q) p.q = q;
  if (category) p.category = category;
  if (sortBy) p.sortBy = sortBy as ProductsParams["sortBy"];
  if (order) p.order = order as ProductsParams["order"];
  p.page = parsePage(sp?.get("page") ?? null, 1);
  p.limit = parseLimit(sp?.get("limit") ?? null, 10);
  return p;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [params, setParams] = useState<ProductsParams>(() =>
    parseParams(searchParams),
  );

  const syncUrl = useCallback(
    (next: ProductsParams) => {
      const sp = new URLSearchParams();
      if (next.q) sp.set("q", next.q);
      if (next.category) sp.set("category", next.category);
      if (next.sortBy) sp.set("sortBy", next.sortBy);
      if (next.order) sp.set("order", next.order);
      if (next.page && next.page > 1) sp.set("page", String(next.page));
      if (next.limit && next.limit !== 10) sp.set("limit", String(next.limit));
      const qs = sp.toString();
      router.replace(qs ? `?${qs}` : "/", { scroll: false });
    },
    [router],
  );

  const handleChange = useCallback(
    (next: ProductsParams) => {
      if (next.page === params.page) next.page = 1;
      setParams(next);
      syncUrl(next);
    },
    [syncUrl, params],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const next = { ...params, page };
      handleChange(next);
    },
    [params, handleChange],
  );

  const handleLimitChange = useCallback(
    (limit: Limit) => {
      const next = { ...params, limit, page: 1 };
      setParams(next);
      syncUrl(next);
    },
    [params, syncUrl],
  );

  const { data: response, isLoading, error } = useProducts(params);
  const { data: categories } = useCategories();

  const totalPages = response
    ? Math.ceil(response.total / (params.limit ?? 10))
    : 0;

  return (
    <Container maxW="4xl" py={10}>
      <VStack gap={6} align="stretch">
        <Heading size="3xl">publicApiFetch</Heading>

        <Text color="fg.muted">
          Next.js + TanStack Query + Chakra UI v3 + Zod
        </Text>

        <FilterBar
          params={params}
          onChange={handleChange}
          categories={categories ?? []}
        />

        {isLoading && <Text>Loading products...</Text>}

        {error && (
          <Text color="red.500">Error: {(error as Error).message}</Text>
        )}

        {response?.products?.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
        <HStack align="center" justify="space-between">
          <PaginationBar
            page={params.page ?? 1}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
          <HStack>
            <LimitSelect
              value={(params.limit as Limit) ?? 10}
              onChange={handleLimitChange}
            />
            {response && (
              <Text fontSize="sm" color="fg.muted" textWrap="nowrap">
                of {response.total} products
              </Text>
            )}
          </HStack>
        </HStack>
      </VStack>
    </Container>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
