export const PRODUCT_CARD_PLACEHOLDER_IMAGE =
  "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=1200";

export function resolveProductCardImage(src?: string | null): string {
  const trimmed = src?.trim();
  return trimmed || PRODUCT_CARD_PLACEHOLDER_IMAGE;
}
