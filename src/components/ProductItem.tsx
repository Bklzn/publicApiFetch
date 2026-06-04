import { HStack } from "@chakra-ui/react";
import { Box, Heading, Text, Image } from "@chakra-ui/react";
import { SingleProductInAllProducts } from "@/schemas/product";

export function ProductItem({
  product,
}: {
  product: SingleProductInAllProducts;
}) {
  return (
    <HStack key={product.id} p={4} borderWidth="1px" borderRadius="lg" gap={4}>
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
  );
}
