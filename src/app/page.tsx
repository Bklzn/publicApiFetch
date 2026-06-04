"use client";

import { Suspense, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useProducts, useCategories } from "@/hooks/use-products";
import { FilterBar } from "@/components/FilterBar";
import type { ProductsParams } from "@/lib/api";

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
  return p;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [params, setParams] = useState<ProductsParams>(() =>
    parseParams(searchParams),
  );

  const handleChange = useCallback(
    (next: ProductsParams) => {
      setParams(next);
      const sp = new URLSearchParams();
      if (next.q) sp.set("q", next.q);
      if (next.category) sp.set("category", next.category);
      if (next.sortBy) sp.set("sortBy", next.sortBy);
      if (next.order) sp.set("order", next.order);
      const qs = sp.toString();
      router.replace(qs ? `?${qs}` : "/", { scroll: false });
    },
    [router],
  );

  const { data: response, isLoading, error } = useProducts(params);
  const { data: categories } = useCategories();

  return (
    <Container maxW="4xl" py={10}>
      <VStack gap={6} align="stretch">
        <Heading size="3xl">publicApiFetch</Heading>

        <FilterBar
          params={params}
          onChange={handleChange}
          categories={categories ?? []}
        />

        {isLoading && <Text>Loading products...</Text>}

        {error && <Text color="red.500">Error: {(error as Error).message}</Text>}

        {response?.products?.map((product) => (
          <HStack
            key={product.id}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            gap={4}
          >
            <Image
              src={product.thumbnail}
              alt={product.title}
              boxSize="80px"
              objectFit="cover"
              borderRadius="md"
            />
            <Box flex={1}>
              <Heading size="sm">{product.title}</Heading>
              <Text fontSize="sm" color="fg.muted">
                {product.category}
              </Text>
            </Box>
            <Text fontWeight="bold">${product.price}</Text>
          </HStack>
        ))}
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
