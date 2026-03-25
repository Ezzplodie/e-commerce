import { Product } from "@/entities/product/types";

const API_BASE = "http://localhost:4000";

const toAbsoluteImageUrl = (imageLink: string) => {
  if (!imageLink) {
    return "";
  }

  if (imageLink.startsWith("http://") || imageLink.startsWith("https://")) {
    return imageLink;
  }

  return `${API_BASE}${imageLink}`;
};

const normalizeProductImages = (product: Product): Product => ({
  ...product,
  variants: (product.variants || []).map((variant) => ({
    ...variant,
    variant_images: (variant.variant_images || []).map((image) => ({
      ...image,
      image_link: toAbsoluteImageUrl(image.image_link),
    })),
  })),
});

export async function getProductBySlug(slug: string): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const productData: Product = await response.json();
  return normalizeProductImages(productData);
}
