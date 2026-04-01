import { VariantImage } from "../types";

export function dedupeVariantImages(images: VariantImage[]): VariantImage[] {
  const seen = new Set<string>();

  return [...images]
    .sort((first, second) => first.image_order - second.image_order)
    .filter((image) => {
      const key = `${image.image_link}-${image.image_order}`;

      if (!image.image_link || seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}
