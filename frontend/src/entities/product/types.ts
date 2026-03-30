export type VariantImage = {
  id: number;
  image_link: string;
  image_order: number;
  storage_bucket?: string | null;
  storage_path?: string | null;
  content_type?: string | null;
  file_size?: number | null;
};

export type ProductVariant = {
  id: number;
  sku: string;
  price: number | null;
  stock: number;
  attributes: Record<string, string>;
  variant_images: VariantImage[];
  product_id?: number;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  base_price: number;
  category_id?: number;
  category_name?: string;
  category_slug?: string;
  variants: ProductVariant[];
  variant_count?: number;
  total_stock?: number;
};

export type ProductsResponse = {
  products: Product[];
  page: number;
  limit: number;
  total: number;
};
