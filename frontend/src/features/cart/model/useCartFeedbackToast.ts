"use client";

import { useEffect } from "react";
import { useCartStore } from "./cartStore";

export const useCartFeedbackToast = () => {
  const feedback = useCartStore((state) => state.cartFeedback);
  const onDismiss = useCartStore((state) => state.dismissCartFeedback);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      onDismiss();
    }, 3400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [feedback, onDismiss]);

  if (!feedback) {
    return {
      feedback: null,
      onDismiss,
      addedLabel: "",
      totalLabel: "",
      handleViewCart: () => {
        onDismiss();
        useCartStore.getState().openCart();
      },
    };
  }

  const { addedQuantity, totalQuantity } = feedback;

  return {
    feedback,
    onDismiss,
    addedLabel:
      addedQuantity === 1 ? "1 item added" : `${addedQuantity} items added`,
    totalLabel:
      totalQuantity === 1
        ? "1 item in cart"
        : `${totalQuantity} items in cart`,
    handleViewCart: () => {
      onDismiss();
      useCartStore.getState().openCart();
    },
  };
};
