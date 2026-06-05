import { describe, it, expect } from "vitest";
import { ProductSchema, AllProductsSchema } from "../product";

const validProduct = {
  id: 1,
  title: "Test Product",
  description: "A test product description",
  category: "beauty",
  price: 29.99,
  discountPercentage: 10.5,
  rating: 4.5,
  stock: 100,
  tags: ["test", "beauty"],
  brand: "TestBrand",
  sku: "TST-123",
  weight: 200,
  dimensions: { width: 10, height: 5, depth: 3 },
  warrantyInformation: "1 year warranty",
  shippingInformation: "Ships in 2-3 days",
  availabilityStatus: "In Stock",
  reviews: [
    {
      rating: 5,
      comment: "Great product",
      date: "2024-01-15",
      reviewerName: "John Doe",
      reviewerEmail: "john@example.com",
    },
  ],
  returnPolicy: "30 days return",
  minimumOrderQuantity: 1,
  meta: {
    createdAt: "2024-01-01",
    updatedAt: "2024-06-01",
    barcode: "123456789",
    qrCode: "https://example.com/qr",
  },
  thumbnail: "https://example.com/thumb.jpg",
  images: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
};

const validAllProducts = {
  products: [
    {
      id: 1,
      title: "Test Product",
      category: "beauty",
      price: 29.99,
      thumbnail: "https://example.com/thumb.jpg",
    },
  ],
  total: 1,
  skip: 0,
  limit: 10,
};

describe("ProductSchema", () => {
  it("validates a correct product", () => {
    const result = ProductSchema.parse(validProduct);
    expect(result.id).toBe(1);
    expect(result.title).toBe("Test Product");
    expect(result.reviews).toHaveLength(1);
    expect(result.dimensions.width).toBe(10);
  });

  it("strips extra fields", () => {
    const result = ProductSchema.parse({ ...validProduct, extraField: "should be stripped" });
    expect(result).not.toHaveProperty("extraField");
  });

  it("throws on missing required field", () => {
    const { id, ...noId } = validProduct;
    expect(() => ProductSchema.parse(noId)).toThrow();
  });

  it("throws on wrong type (string instead of number)", () => {
    expect(() =>
      ProductSchema.parse({ ...validProduct, price: "not-a-number" }),
    ).toThrow();
  });

  it("throws on empty object", () => {
    expect(() => ProductSchema.parse({})).toThrow();
  });

  it("accepts optional brand as undefined", () => {
    const { brand, ...noBrand } = validProduct;
    const result = ProductSchema.parse(noBrand);
    expect(result.brand).toBeUndefined();
  });
});

describe("AllProductsSchema", () => {
  it("validates a correct response", () => {
    const result = AllProductsSchema.parse(validAllProducts);
    expect(result.products).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it("validates empty products array", () => {
    const result = AllProductsSchema.parse({ ...validAllProducts, products: [] });
    expect(result.products).toHaveLength(0);
  });

  it("throws on missing total", () => {
    const { total, ...noTotal } = validAllProducts;
    expect(() => AllProductsSchema.parse(noTotal)).toThrow();
  });

  it("strips extra fields from product items", () => {
    const withExtra = {
      ...validAllProducts,
      products: [{ ...validAllProducts.products[0], extra: "ignored" }],
    };
    const result = AllProductsSchema.parse(withExtra);
    expect(result.products[0]).not.toHaveProperty("extra");
  });

  it("only picks id, title, category, price, thumbnail", () => {
    const withExtraFields = {
      ...validAllProducts,
      products: [
        {
          ...validAllProducts.products[0],
          description: "should be stripped",
          stock: 100,
        },
      ],
    };
    const result = AllProductsSchema.parse(withExtraFields);
    expect(result.products[0]).not.toHaveProperty("description");
    expect(result.products[0]).not.toHaveProperty("stock");
  });
});
