export type ProductVariant = {
  id: number;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
};

export type Product = {
  id: number;
  name: string;
  base_price: number;
  category_name: string;
  category_slug: string;
  variants: ProductVariant[];
};
