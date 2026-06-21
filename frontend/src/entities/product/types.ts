export type VariantImage = {
  id: number;
  image_link: string;
  image_order: number;
  storage_bucket?: string | null;
  storage_path?: string | null;
  content_type?: string | null;
  file_size?: number | null;
};

export type ProductMaterial = {
  id: number;
  name: string;
  description?: string | null;
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
  fitting?: string | null;
  product_detail?: string | null;
  fabric_care?: string | null;
  material_id?: number | null;
  material?: ProductMaterial | null;
  material_name?: string | null;
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

// List endpoint often returns "summary" products (no variants, base_price as string).
export type ProductListItem = Omit<Product, "variants" | "base_price"> & {
  base_price: number;
  variants: ProductVariant[];
  default_variant_id?: number | null;
  thumbnail_image_link?: string | null;
  colors?: string[];
  enabled_colors?: string[];
};

export type ProductsListResponse = {
  products: ProductListItem[];
  page: number;
  limit: number;
  total: number;
};

export type AttributeValue = {
  id: number;
  attribute_id: number;
  attribute_code: string;
  attribute_name: string;
  value: string;
};

export type FilterFacetItem = {
  value: string;
  count: number;
};

export type FilterFacetsResponse = {
  facets: {
    color: FilterFacetItem[];
    size: FilterFacetItem[];
    fabric: FilterFacetItem[];
  };
  selected: {
    color: string[];
    size: string[];
    fabric: string[];
    sortby: string | null;
    collection: string | null;
  };
};
