import { ProductVariant } from "@/entities/product/types";
import { ProductFormState, VariantFormState } from "../types";

export const emptyProductForm: ProductFormState = {
  category_id: "",
  name: "",
  slug: "",
  base_price: "",
  description: "",
  fitting: "",
  product_detail: "",
  fabric_care: "",
  material_id: "",
};

export const emptyVariantForm: VariantFormState = {
  sku: "",
  price: "",
  stock: "0",
  color: "",
  size: "",
};

export const createVariantDrafts = (
  variants: ProductVariant[],
): Record<number, VariantFormState> => {
  const nextDrafts: Record<number, VariantFormState> = {};

  for (const variant of variants) {
    nextDrafts[variant.id] = {
      sku: variant.sku || "",
      price: String(variant.price ?? ""),
      stock: String(variant.stock ?? 0),
      color: variant.attributes?.color ?? "",
      size: variant.attributes?.size ?? "",
    };
  }

  return nextDrafts;
};
