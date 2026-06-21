import { create } from "zustand";
import { WishListStore } from "./types";
import {
  addItemToWishList,
  deleteItemFromWishList,
  getWishList,
} from "../api/wishList";

export const useWishListStore = create<WishListStore>((set, get) => ({
  items: [],
  isLoading: false,
  isLoaded: false,
  error: null,

  load: async () => {
    try {
      set({ isLoading: true, error: null });

      const items = await getWishList();

      set({
        items,
        isLoaded: true,
        isLoading: false,
      });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Unknown error",
        isLoading: false,
      });
    }
  },

  add: async (variantId: number) => {
    try {
      const item = await addItemToWishList(variantId);

      set((s) => ({
        items: [...s.items, item],
      }));
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
  },

  remove: async (variantId: number) => {
    try {
      await deleteItemFromWishList(variantId);

      set((s) => ({
        items: s.items.filter((i) => i.variant_id !== variantId),
      }));
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
  },

  clear: () =>
    set({
      items: [],
      isLoaded: false,
      error: null,
    }),

  has: (variantId: number) =>
    get().items.some((i) => i.variant_id === variantId),
}));
