import type { ProductVariant } from "../types";

const FALLBACK_IMAGES = [
  "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

type ImageLikeProduct = {
  thumbnail_image_link?: string | null;
  variants?: ProductVariant[];
};

export function getProductCardImage(product: ImageLikeProduct, index = 0) {
  if (product.thumbnail_image_link) {
    return product.thumbnail_image_link;
  }

  const firstVariantImage = product.variants?.find(
    (v) => (v.variant_images || []).length > 0,
  )?.variant_images?.[0]?.image_link;

  if (firstVariantImage) {
    return firstVariantImage;
  }

  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length] || FALLBACK_IMAGES[0];
}
