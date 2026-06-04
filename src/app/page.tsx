"use client";

import {
  Box,
  Container,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useProducts } from "@/hooks/use-products";

export default function Home() {
  const { data: response, isLoading, error } = useProducts();

  return (
    <Container maxW="4xl" py={10}>
      <VStack gap={6} align="stretch">
        <Heading size="3xl">publicApiFetch</Heading>

        <Text color="fg.muted">
          Next.js + TanStack Query + Chakra UI v3 + Zod
        </Text>

        {isLoading && <Text>Loading products...</Text>}

        {error && (
          <>
            {console.error(error)}
            <Text color="red.500">Error: {(error as Error).message}</Text>
          </>
        )}

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
