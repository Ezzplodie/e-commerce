import { plusSizeImage } from "@/shared/assets/images";
import type { CartItemImage } from "../model/types";

export function resolveCartItemImage(image?: CartItemImage) {
  if (!image) {
    return plusSizeImage.src;
  }

  return typeof image === "string" ? image || plusSizeImage.src : image.src;
}
