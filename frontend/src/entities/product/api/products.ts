import { Product, ProductsListResponse } from "../types";

const API_BASE = "http://localhost:4000";

export const toAbsoluteImageUrl = (imageLink: string) => {
  if (!imageLink) return "";
  if (imageLink.startsWith("http://") || imageLink.startsWith("https://")) {
    return imageLink;
  }
  const normalized = imageLink.startsWith("/") ? imageLink : `/${imageLink}`;
  return `${API_BASE}${normalized}`;
};

type VariantImageRaw = Product["variants"][number]["variant_images"][number] & {
  legacy_image_link?: string | null;
};

const resolveVariantImageLink = (image: VariantImageRaw) => {
  const direct =
    image.image_link?.trim() ||
    image.legacy_image_link?.trim() ||
    "";
  return toAbsoluteImageUrl(direct);
};

const normalizeProductImages = (product: Product): Product => ({
  ...product,
  variants: (product.variants || []).map((variant) => ({
    ...variant,
    variant_images: (variant.variant_images || []).map((image) => {
      const raw = image as VariantImageRaw;
      return {
        ...raw,
        image_link: resolveVariantImageLink(raw),
      };
    }),
  })),
});

const normalizeListProduct = (product: unknown) => {
  const p = product as Partial<Product> & {
    base_price?: number | string;
    thumbnail_image_link?: string | null;
  };
  const basePrice =
    typeof p.base_price === "string" ? Number(p.base_price) : p.base_price;

  const normalized = normalizeProductImages({
    ...(p as Product),
    base_price: Number.isFinite(basePrice as number) ? (basePrice as number) : 0,
    variants: (p.variants || []) as Product["variants"],
  });

  return {
    ...normalized,
    thumbnail_image_link: p.thumbnail_image_link
      ? toAbsoluteImageUrl(p.thumbnail_image_link)
      : null,
  };
};

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

export async function getProducts(
  limit = 10,
  page = 1,
  signal?: AbortSignal,
): Promise<ProductsListResponse> {
  const response = await fetch(
    `${API_BASE}/products?limit=${limit}&page=${page}`,
    {
      cache: "no-store",
      signal,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const productsData: ProductsListResponse = await response.json();
  return {
    ...productsData,
    products: (productsData.products || []).map(normalizeListProduct),
  };
}

