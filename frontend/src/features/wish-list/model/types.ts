import { ProductVariant } from "@/entities/product/types";
export type WishListItem = ProductVariant & {
  wish_list_id: number;
  created_at: string;
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
