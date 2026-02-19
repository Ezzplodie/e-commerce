import { useState } from "react";
import { ProductVariant } from "@/entities/product/types";

type VariantAttributes = {
  color?: string;
  size?: string;
};
export function useSelectedAttributes(variants: ProductVariant[]) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
}



