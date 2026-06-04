import { Box, Text, SimpleGrid } from "@chakra-ui/react";

type Props = {
  price: number;
  discountPercentage: number;
  rating: number;
};

export function ProductDetailStats({ price, discountPercentage, rating }: Props) {
  return (
    <SimpleGrid columns={3} gap={4}>
      <Box textAlign="center">
        <Text fontSize="2xl" fontWeight="bold">
          ${price}
        </Text>
        <Text fontSize="xs" color="fg.muted">
          Price
        </Text>
      </Box>
      <Box textAlign="center">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color={discountPercentage > 0 ? "green.500" : undefined}
        >
          {discountPercentage > 0 ? `${discountPercentage}%` : "-"}
        </Text>
        <Text fontSize="xs" color="fg.muted">
          Discount
        </Text>
      </Box>
      <Box textAlign="center">
        <Text fontSize="2xl" fontWeight="bold">
          {rating}
        </Text>
        <Text fontSize="xs" color="fg.muted">
          Rating
        </Text>
      </Box>
    </SimpleGrid>
  );
}
