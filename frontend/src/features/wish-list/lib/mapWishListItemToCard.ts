import { WishListItem } from "../model/types";
export function mapWishListItemToCard(item: WishListItem) {
  const subtitle = [item.color, item.size].filter(Boolean).join(" · ");

  return {
    key: String(item.wish_list_id),
    variantId: item.variant_id,
    title: item.product_name,
    subtitle: subtitle || undefined,
    price: item.price ?? 0,
    image: item.image_url ?? "",
    href: `/products/${item.product_slug}`,
    colors: item.color ? [item.color] : undefined,
    selectedColor: item.color ?? undefined,
  };
}
