import z from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  tags: z.array(z.string()),
  brand: z.string().optional(),
  sku: z.string(),
  weight: z.number(),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
    depth: z.number(),
  }),
  warrantyInformation: z.string(),
  shippingInformation: z.string(),
  availabilityStatus: z.string(),
  reviews: z.array(
    z.object({
      rating: z.number(),
      comment: z.string(),
      date: z.string(),
      reviewerName: z.string(),
      reviewerEmail: z.string(),
    }),
  ),
  returnPolicy: z.string(),
  minimumOrderQuantity: z.number(),
  meta: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    barcode: z.string(),
    qrCode: z.string(),
  }),
  thumbnail: z.string(),
  images: z.array(z.string()),
});

const SingleProductInAllProducts = ProductSchema.pick({
  id: true,
  title: true,
  category: true,
  price: true,
  thumbnail: true,
});

export const AllProductsSchema = z.object({
  products: z.array(SingleProductInAllProducts),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type SingleProductInAllProducts = z.infer<
  typeof SingleProductInAllProducts
>;
export type Product = z.infer<typeof ProductSchema>;
export type AllProducts = z.infer<typeof AllProductsSchema>;
