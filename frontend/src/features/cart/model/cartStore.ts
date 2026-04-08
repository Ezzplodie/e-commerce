import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItemData, CartStore } from "./types";

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      cartFeedback: null,
      isOpen: false,
      addItem: (item: CartItemData) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          const nextItems = existingItem
            ? state.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      quantity: i.quantity + item.quantity,
                      image: i.image || item.image,
                    }
                  : i,
              )
            : [...state.items, item];

          return {
            items: nextItems,
            cartFeedback: {
              item,
              addedQuantity: item.quantity,
              totalQuantity: nextItems.reduce(
                (total, currentItem) => total + currentItem.quantity,
                0,
              ),
              timestamp: Date.now(),
            },
          };
        }),

      dismissCartFeedback: () =>
        set({
          cartFeedback: null,
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
      openCart: () => {
        console.log("Opening cart...");
        set({
          isOpen: true,
        });
      },
      closeCart: () => {
        console.log("Closing cart...");
        set({
          isOpen: false,
        });
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);
