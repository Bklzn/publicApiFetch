import { HStack, Box, Heading, Text, Image, Badge } from "@chakra-ui/react";
import type { SingleProductInAllProducts } from "@/schemas/product";

export function ProductItem({
  product,
  onSelect,
  isSelected,
}: {
  product: SingleProductInAllProducts;
  onSelect: (id: number) => void;
  isSelected: boolean;
}) {
  return (
    <HStack
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      gap={4}
      cursor="pointer"
      onClick={() => onSelect(product.id)}
      bg={isSelected ? "bg.subtle" : undefined}
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
        <Badge fontSize="sm" colorPalette="blue">
          {product.category}
        </Badge>
      </Box>
      <Text fontWeight="bold">${product.price}</Text>
    </HStack>
  );
}
