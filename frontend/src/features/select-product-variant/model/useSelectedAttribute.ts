import { useState } from "react";
import { ProductVariant } from "@/entities/product/types";

export function useSelectedAttributes(variants: ProductVariant[]) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return {
    variants,
    selectedColor,
    selectedSize,
    setSelectedColor,
    setSelectedSize,
  };
}



