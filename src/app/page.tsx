"use client";

import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { useProducts } from "@/hooks/use-products";

export default function Home() {
  const { data: response, isLoading, error } = useProducts();

  return (
    <Container maxW="4xl" py={10}>
      <VStack gap={6} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="3xl">publicApiFetch</Heading>
        </Box>

        <Text color="fg.muted">
          Next.js + TanStack Query + Chakra UI v3 + Zod
        </Text>

        {isLoading && <Text>Loading products...</Text>}

        {error && (
          <>
            {console.log(error)}
            <Text color="red.500">Error: {(error as Error).message}</Text>
          </>
        )}

        {response?.products?.map((product) => (
          <Box key={product.id} p={4} borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={2}>
              {product.title}
            </Heading>
            <Text>{product.description}</Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
}
