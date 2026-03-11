type variantImage = {
  id: number;
  image_link: string;
  image_order: number;
};
export type ProductVariant = {
  id: number;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  variant_images: variantImage[];
};

export type Product = {
  id: number;
  name: string;
  description?: string | null;
  base_price: number;
  category_name: string;
  category_slug: string;
  variants: ProductVariant[];
};
