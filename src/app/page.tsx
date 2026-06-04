"use client";

import { Suspense, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Flex, Box, Heading, Text, HStack, VStack } from "@chakra-ui/react";
import { useProducts, useCategories } from "@/hooks/use-products";
import { FilterBar } from "@/components/FilterBar";
import { LimitSelect } from "@/components/LimitSelect";
import { PaginationBar } from "@/components/PaginationBar";
import { ProductItem } from "@/components/ProductItem";
import { ProductDetails } from "@/components/ProductDetails";
import {
  parsePage,
  parseLimit,
  type ProductsParams,
  type Limit,
} from "@/lib/api";

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

  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  const handleSelect = useCallback((id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const { data: response, isLoading, error } = useProducts(params);
  const { data: categories } = useCategories();

  const totalPages = response
    ? Math.ceil(response.total / (params.limit ?? 10))
    : 0;

  return (
    <Flex maxW="100%" mx={0} px={4}>
      <Box flex="1" minW={0} maxW="4xl" marginX="auto" paddingRight={4} py={10}>
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
            <ProductItem
              key={product.id}
              product={product}
              onSelect={handleSelect}
              isSelected={selectedId === product.id}
            />
          ))}

          {response && (
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
                <Text fontSize="sm" color="fg.muted" textWrap="nowrap">
                  of {response.total} products
                </Text>
              </HStack>
            </HStack>
          )}
        </VStack>
      </Box>

      <Box
        as="aside"
        style={{
          maxWidth: selectedId ? "30vw" : "0px",
          transition: "max-width 0.4s ease",
          overflow: selectedId ? undefined : "hidden",
          position: "sticky",
          top: 0,
          height: "100dvh",
        }}
        borderLeftWidth={selectedId ? "1px" : "0px"}
        borderColor="border"
      >
        <Box w="30vw" h="100dvh" overflowY="auto" py={10} pl={6} pr={4}>
          <ProductDetails productId={selectedId} />
        </Box>
      </Box>
    </Flex>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
