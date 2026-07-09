import { getProductCardImage } from "./getProductCardImage";
import type { ProductListItem } from "../types";
import type { ProductCardProps } from "@/shared/ui/ProductCard";

export function mapProductListItemToCard(
  product: ProductListItem,
  index = 0,
): ProductCardProps & { key: string; variantId?: number } {
  return {
    key: product.slug || String(product.id),
    variantId: product.default_variant_id ?? undefined,
    title: product.name,
    subtitle: product.description ?? undefined,
    price: product.base_price,
    image: getProductCardImage(product, index),
    href: product.slug ? `/products/${product.slug}` : "/products",
    colors: product.colors ?? [],
    enabledColors: new Set(product.enabled_colors ?? []),
  };
}
