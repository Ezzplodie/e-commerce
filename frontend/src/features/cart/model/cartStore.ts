import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItemData, CartStore } from "./types";

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item: CartItemData) =>
        set((state) => {
          console.log("Adding item to cart:", item);
          const existingItem = state.items.find((i) => i.id === item.id);
          return {
            items: existingItem
              ? state.items.map((i) =>
                  i.id === item.id
                    ? {
                        ...i,
                        quantity: i.quantity + item.quantity,
                        image: i.image || item.image,
                      }
                    : i,
                )
              : [...state.items, item],
          };
        }),

      removeItem: (id: number) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id: number, quantity: number) =>
        set((state) => ({
          items:
            quantity === 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
    }),
    {
      name: "cart-storage",
    },
  ),
);
