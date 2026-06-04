"use client";

import { useProduct } from "@/hooks/use-products";
import { Box, Heading, Spinner, Text, Code } from "@chakra-ui/react";

type Props = {
  productId: number | null;
};

export function ProductDetails({ productId }: Props) {
  const { data, isLoading, error } = useProduct(productId);

  if (!productId) return null;

  return (
    <Box width="100%">
      <Heading size="md" mb={4}>
        Product #{productId}
      </Heading>

      {isLoading && (
        <Box display="flex" justifyContent="center" py={10}>
          <Spinner />
        </Box>
      )}

      {error &&
        (console.error(error),
        (<Text color="red.500">Error: {(error as Error).message}</Text>))}

      {data && (
        <Code
          as="pre"
          display="block"
          p={4}
          borderRadius="md"
          whiteSpace="pre-wrap"
          fontSize="sm"
          maxH="calc(100vh - 150px)"
          overflowY="auto"
        >
          {JSON.stringify(data, null, 2)}
        </Code>
      )}
    </Box>
  );
}
