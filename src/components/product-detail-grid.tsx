import { Box, Grid, GridItem, Heading } from "@chakra-ui/react";

type Dimensions = {
  width: number;
  height: number;
  depth: number;
};

type Props = {
  brand: string | undefined;
  weight: number;
  dimensions: Dimensions;
  stock: number;
  minimumOrderQuantity: number;
};

export function ProductDetailGrid({
  brand,
  weight,
  dimensions,
  stock,
  minimumOrderQuantity,
}: Props) {
  return (
    <Box>
      <Heading size="sm" mb={2}>
        Details
      </Heading>
      <Grid templateColumns="1fr 1fr" gapX={4} gapY={2} fontSize="sm">
        <GridItem color="fg.muted">Brand</GridItem>
        <GridItem>{brand || "-"}</GridItem>

        <GridItem color="fg.muted">Weight</GridItem>
        <GridItem>{weight}g</GridItem>

        <GridItem color="fg.muted">Dimensions</GridItem>
        <GridItem>
          {dimensions.width} × {dimensions.height} × {dimensions.depth} cm
        </GridItem>

        <GridItem color="fg.muted">Stock</GridItem>
        <GridItem>{stock}</GridItem>

        <GridItem color="fg.muted">Min. Order Qty</GridItem>
        <GridItem>{minimumOrderQuantity}</GridItem>
      </Grid>
    </Box>
  );
}
