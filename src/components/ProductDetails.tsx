"use client";

import { useProduct } from "@/hooks/use-products";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Badge,
  VStack,
  HStack,
  Separator,
} from "@chakra-ui/react";
import { ProductImages } from "@/components/product-images";
import { ProductDetailStats } from "@/components/product-detail-stats";
import { ProductDetailGrid } from "@/components/product-detail-grid";
import { ProductReviews } from "@/components/product-detail-reviews";
import { useEffect, useRef } from "react";

type Props = {
  productId: number | null;
};

export function ProductDetails({ productId }: Props) {
  const { data, isLoading, error } = useProduct(productId);
  const asideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (asideRef.current) {
      asideRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [asideRef, productId]);

  if (!productId) return null;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return <Text color="red.500">Error: {(error as Error).message}</Text>;
  }

  if (!data) return null;

  const p = data;

  return (
    <VStack gap={5} align="stretch" width="100%" ref={asideRef}>
      <Box>
        <Heading size="xl">{p.title}</Heading>
        <HStack mt={2} gap={2} flexWrap="wrap">
          <Badge colorPalette="blue">{p.category}</Badge>
          <Badge colorPalette={p.stock > 0 ? "green" : "red"}>
            {p.availabilityStatus}
          </Badge>
          <Text fontSize="sm" color="fg.muted">
            SKU: {p.sku}
          </Text>
        </HStack>
      </Box>

      <Separator />

      <ProductImages
        title={p.title}
        thumbnail={p.thumbnail}
        images={p.images}
      />

      <Separator />

      <ProductDetailStats
        price={p.price}
        discountPercentage={p.discountPercentage}
        rating={p.rating}
      />

      <Separator />

      <Box>
        <Heading size="sm" mb={1}>
          Description
        </Heading>
        <Text color="fg.muted" fontSize="sm">
          {p.description}
        </Text>
      </Box>

      <Separator />

      <ProductDetailGrid
        brand={p.brand}
        weight={p.weight}
        dimensions={p.dimensions}
        stock={p.stock}
        minimumOrderQuantity={p.minimumOrderQuantity}
      />

      <Separator />

      {p.tags.length > 0 && (
        <Box>
          <Heading size="sm" mb={2}>
            Tags
          </Heading>
          <HStack gap={2} flexWrap="wrap">
            {p.tags.map((tag) => (
              <Badge key={tag} variant="subtle">
                {tag}
              </Badge>
            ))}
          </HStack>
        </Box>
      )}

      <Separator />

      <Box>
        <Heading size="sm" mb={2}>
          Policies
        </Heading>
        <VStack gap={2} align="stretch" fontSize="sm">
          <Box>
            <Text fontWeight="medium">Warranty</Text>
            <Text color="fg.muted">{p.warrantyInformation}</Text>
          </Box>
          <Box>
            <Text fontWeight="medium">Shipping</Text>
            <Text color="fg.muted">{p.shippingInformation}</Text>
          </Box>
          <Box>
            <Text fontWeight="medium">Returns</Text>
            <Text color="fg.muted">{p.returnPolicy}</Text>
          </Box>
        </VStack>
      </Box>

      <Separator />

      <ProductReviews reviews={p.reviews} />

      <Separator />

      <Box>
        <Heading size="sm" mb={2}>
          Meta
        </Heading>
        <Box fontSize="sm" color="fg.muted">
          <HStack justify="space-between" py={1}>
            <Text>Created</Text>
            <Text>
              {new Date(p.meta.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </HStack>
          <HStack justify="space-between" py={1}>
            <Text>Updated</Text>
            <Text>
              {new Date(p.meta.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </HStack>
          <HStack justify="space-between" py={1}>
            <Text>Barcode</Text>
            <Text>{p.meta.barcode}</Text>
          </HStack>
        </Box>
      </Box>
    </VStack>
  );
}
