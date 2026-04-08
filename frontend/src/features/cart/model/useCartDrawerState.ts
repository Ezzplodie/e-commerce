"use client";

import { useState } from "react";
import type { CartItemData } from "./types";

type ConfirmState = {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
};

type UseCartDrawerStateParams = {
  onRemoveItem?: (item: CartItemData) => void;
  onQuantityChange?: (item: CartItemData, quantity: number) => void;
};

export const useCartDrawerState = ({
  onRemoveItem,
  onQuantityChange,
}: UseCartDrawerStateParams) => {
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const confirmRemove = (item: CartItemData) => {
    setConfirmState({
      title: "Remove item",
      message: `Are you sure you want to remove ${item.title} from the cart?`,
      onConfirm: () => onRemoveItem?.(item),
    });
  };

  const handleConfirmRemove = async () => {
    if (!confirmState) {
      return;
    }

    try {
      await confirmState.onConfirm();
      setConfirmState(null);
    } catch (cartError) {
      console.error("Failed to remove cart item:", cartError);
    }
  };

  return {
    increaseHandler: (item: CartItemData) => {
      onQuantityChange?.(item, item.quantity + 1);
    },
    decreaseHandler: (item: CartItemData) => {
      if (item.quantity === 1) {
        confirmRemove(item);
        return;
      }

      onQuantityChange?.(item, item.quantity - 1);
    },
    deleteHandler: (item: CartItemData) => {
      confirmRemove(item);
    },
    confirmationDialog: {
      open: confirmState !== null,
      title: confirmState?.title || "",
      message: confirmState?.message || "",
      onCancel: () => setConfirmState(null),
      onConfirm: handleConfirmRemove,
    },
  };
};
