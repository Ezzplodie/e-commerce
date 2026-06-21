import { parseResponse } from "@/shared/api/parseResponse";
import { API_BASE } from "@/shared/api/config";
import {
  AttributeValue,
  FilterFacetsResponse,
  Product,
  ProductsListResponse,
} from "../types";

export async function getAttributeValues(
  attributeCode?: string,
): Promise<AttributeValue[]> {
  const query = attributeCode
    ? `?code=${encodeURIComponent(attributeCode)}`
    : "";
  const response = await fetch(`${API_BASE}/attribute-values${query}`, {
    method: "GET",
  });

  return parseResponse<AttributeValue[]>(response);
}

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
  return getProductsByQuery(`limit=${limit}&page=${page}`, signal);
}

export async function getProductsByQuery(
  queryString: string,
  signal?: AbortSignal,
): Promise<ProductsListResponse> {
  const normalizedQuery = queryString?.trim()
    ? queryString.startsWith("?")
      ? queryString.slice(1)
      : queryString
    : "";

  const response = await fetch(`${API_BASE}/products?${normalizedQuery}`, {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const productsData: ProductsListResponse = await response.json();
  return {
    ...productsData,
    products: (productsData.products || []).map(normalizeListProduct),
  };
}

export async function getFilterFacets(
  queryString: string,
  signal?: AbortSignal,
): Promise<FilterFacetsResponse> {
  const normalizedQuery = queryString?.trim()
    ? queryString.startsWith("?")
      ? queryString.slice(1)
      : queryString
    : "";

  const response = await fetch(`${API_BASE}/filters?${normalizedQuery}`, {
    cache: "no-store",
    signal,
  });

  return parseResponse<FilterFacetsResponse>(response);
}

