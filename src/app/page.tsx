"use client";

import { Suspense, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Flex,
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
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
import { useCheckViewport } from "@/hooks/use-check-viewport";

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
  const [params, setParams] = useState<ProductsParams>(() =>
    parseParams(searchParams),
  );

  const [selectedId, setSelectedId] = useState<number | null>(() => {
    const raw = searchParams?.get("id");
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  });

  const [isMobile] = useCheckViewport();

  const syncUrl = useCallback(
    (next: ProductsParams, selectedId: number | null) => {
      const sp = new URLSearchParams();
      if (next.q) sp.set("q", next.q);
      if (next.category) sp.set("category", next.category);
      if (next.sortBy) sp.set("sortBy", next.sortBy);
      if (next.order) sp.set("order", next.order);
      if (next.page && next.page > 1) sp.set("page", String(next.page));
      if (next.limit && next.limit !== 10) sp.set("limit", String(next.limit));
      if (selectedId) sp.set("id", String(selectedId));
      const qs = sp.toString();
      const url = qs ? `?${qs}` : window.location.pathname;
      window.history.replaceState(null, "", url);
    },
    [],
  );

  const handleChange = useCallback(
    (next: ProductsParams) => {
      if (next.page === params.page) next.page = 1;
      setParams(next);
      syncUrl(next, selectedId);
    },
    [syncUrl, params, selectedId],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const next = { ...params, page };
      setParams(next);
      syncUrl(next, selectedId);
    },
    [params, syncUrl, selectedId],
  );

  const handleLimitChange = useCallback(
    (limit: Limit) => {
      const next = { ...params, limit, page: 1 };
      setParams(next);
      syncUrl(next, selectedId);
    },
    [params, syncUrl, selectedId],
  );

  const handleSelect = useCallback(
    (id: number) => {
      const next = selectedId === id ? null : id;
      setSelectedId(next);
      syncUrl(params, next);
    },
    [params, selectedId, syncUrl],
  );

  const { data: response, isLoading, error } = useProducts(params);
  const { data: categories } = useCategories();

  const totalPages = response
    ? Math.ceil(response.total / (params.limit ?? 10))
    : 0;

  return (
    <Flex maxW="100%" mx={0} px={4}>
      <Box flex="1" minW={0} maxW="4xl" marginX="auto" py={10}>
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

          {isLoading && (
            <Box display="flex" justifyContent="center" py={10}>
              <Spinner />
            </Box>
          )}

          {error && (
            <Text color="red.500">Error: {(error as Error).message}</Text>
          )}

          {response && response.total === 0 && (
            <VStack my={10}>
              <Heading size="3xl" color="fg.muted">
                No products found
              </Heading>
              <Text color="fg.muted">Try changing the filters</Text>
            </VStack>
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
            <HStack
              align="center"
              justify="center"
              flexWrap={"wrap-reverse"}
              gap={20}
              gapY={4}
              marginX="auto"
            >
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
        marginLeft={isMobile ? "0px" : 4}
        position={isMobile ? "fixed" : "sticky"}
        top={isMobile ? undefined : 0}
        bottom={isMobile ? 0 : undefined}
        left={isMobile ? 0 : undefined}
        right={isMobile ? 0 : undefined}
        zIndex={isMobile ? "docked" : undefined}
        h={isMobile ? "70%" : "100dvh"}
        bg={isMobile ? "bg.panel" : undefined}
        borderColor="border"
        pt={isMobile ? "50px" : 0}
        style={{
          ...(isMobile
            ? {
                transform: selectedId ? "translateY(0)" : "translateY(100%)",
                transition: "transform 0.3s ease",
                borderTopWidth: selectedId ? "1px" : "0px",
                boxShadow: selectedId ? "0 -4px 20px rgba(0,0,0,0.15)" : "none",
              }
            : {
                maxWidth: selectedId ? "600px" : "0px",
                transition: "max-width 0.3s ease",
                overflow: selectedId ? undefined : "hidden",
                borderLeftWidth: selectedId ? "1px" : "0px",
              }),
        }}
      >
        {isMobile && selectedId && (
          <IconButton
            position="absolute"
            top={3}
            right={3}
            size="sm"
            variant="ghost"
            aria-label="Close"
            onClick={() => handleSelect(selectedId)}
          >
            <LuX />
          </IconButton>
        )}

        <Box
          w={isMobile ? "100%" : "600px"}
          h="100%"
          overflowY="auto"
          py={10}
          pl={6}
          pr={4}
          pt={isMobile ? 0 : 10}
          style={{
            ...(isMobile
              ? {}
              : {
                  transition: "transform 0.3s ease",
                  transform: selectedId ? "scaleX(1)" : "scaleX(0)",
                  opacity: selectedId ? 1 : 0,
                }),
          }}
        >
          <ProductDetails key={selectedId} productId={selectedId} />
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
