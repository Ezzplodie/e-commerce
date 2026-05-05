export type Material = {
  id: number;
  name: string;
  description?: string | null;
};

export type ProductDto = {
  category_id: number;
  name: string;
  base_price: number;
  slug: string;
  description?: string;
  fitting?: string;
  product_detail?: string;
  fabric_care?: string;
  material_id?: number;
};

export type UpdateProductDto = Partial<ProductDto>;

export type VariantDto = {
  product_id: number;
  sku: string;
  price?: number | null;
  stock?: number;
  attribute_value_ids?: number[];
};

export type UpdateVariantDto = Partial<VariantDto>;

export type { AttributeValue } from "@/entities/product/types";

export type AttributeValueDto = {
  attribute_code: string;
  value: string;
};

export type UpdateVariantImageDto = {
  image_order?: number;
};

export type ProductFormState = {
  category_id: string;
  name: string;
  slug: string;
  base_price: string;
  description: string;
  fitting: string;
  product_detail: string;
  fabric_care: string;
  material_id: string;
};

export type VariantFormState = {
  sku: string;
  price: string;
  stock: string;
  color: string;
  size: string;
};
