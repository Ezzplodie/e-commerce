export type WishListItem = {
  wish_list_id: number;
  created_at: string;
  variant_id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  sku: string;
  price: number | null;
  stock: number;
  color: string | null;
  size: string | null;
  image_url: string | null;
};
export type WishListStore = {
  items: WishListItem[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  load: () => Promise<void>;
  add: (variantId: number) => Promise<void>;
  remove: (variantId: number) => Promise<void>;
  clear: () => void;
  has: (variantId: number) => boolean;
};
