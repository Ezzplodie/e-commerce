export type ProductDto = {
  category_id: number;
  name: string;
  base_price: number;
  slug: string;
  description?: string;
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

export type AttributeValue = {
  id: number;
  attribute_id: number;
  attribute_code: string;
  attribute_name: string;
  value: string;
};

export type AttributeValueDto = {
  attribute_code: string;
  value: string;
};

export type UpdateVariantImageDto = {
  image_link?: string;
  image_order?: number;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type CategoryDto = {
  name: string;
  slug: string;
};

export type UpdateCategoryDto = Partial<CategoryDto>;

export type ProductFormState = {
  category_id: string;
  name: string;
  slug: string;
  base_price: string;
  description: string;
};

export type VariantFormState = {
  sku: string;
  price: string;
  stock: string;
  color: string;
};

export type CategoryFormState = {
  name: string;
  slug: string;
};
