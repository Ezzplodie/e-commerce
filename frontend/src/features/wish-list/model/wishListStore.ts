import { create } from "zustand";
import { WishListItem, WishListStore } from "./types";
import { UnauthorizedError } from "@/shared/api/parseResponse";
import {
  addItemToWishList,
  deleteItemFromWishList,
  getWishList,
} from "../api/wishList";

function sameVariantId(
  left: number | string | undefined,
  right: number,
): boolean {
  return Number(left) === Number(right);
}

export const useWishListStore = create<WishListStore>((set, get) => ({
  items: [],
  isLoading: false,
  isLoaded: false,
  error: null,

  load: async () => {
    if (get().isLoading) return;

    try {
      set({ isLoading: true, error: null });

      const items = await getWishList();

      set({
        items,
        isLoaded: true,
        isLoading: false,
      });
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        set({
          items: [],
          isLoaded: true,
          isLoading: false,
          error: null,
        });
        return;
      }

      set({
        error: e instanceof Error ? e.message : "Unknown error",
        isLoading: false,
      });
    }
  },

  add: async (variantId: number) => {
    if (get().has(variantId)) {
      await get().remove(variantId);
      return;
    }

    set((s) => ({
      items: [...s.items, { variant_id: variantId } as WishListItem],
    }));

    try {
      const item = await addItemToWishList(variantId);

      if (!get().has(variantId)) {
        await deleteItemFromWishList(variantId).catch(() => undefined);
        return;
      }

      set((s) => ({
        items: s.items.map((i) =>
          sameVariantId(i.variant_id, variantId)
            ? ({ ...item, variant_id: Number(item.variant_id) } as WishListItem)
            : i,
        ),
      }));
    } catch (e) {
      set((s) => ({
        items: s.items.filter((i) => !sameVariantId(i.variant_id, variantId)),
        error: e instanceof Error ? e.message : "Unknown error",
      }));
    }
  },

  remove: async (variantId: number) => {
    const previousItems = get().items;

    set((s) => ({
      items: s.items.filter((i) => !sameVariantId(i.variant_id, variantId)),
    }));

    try {
      await deleteItemFromWishList(variantId);
    } catch (e) {
      set({
        items: previousItems,
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
    get().items.some((i) => sameVariantId(i.variant_id, variantId)),
}));
