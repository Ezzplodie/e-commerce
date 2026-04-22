"use client";

import { useEffect } from "react";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { getCartPricing } from "../../model/cartPricing";
import { useCartStore } from "../../model/cartStore";
import { useCartDrawerState } from "../../model/useCartDrawerState";
import { CheckoutPaymentPage } from "./CheckoutPaymentPage";

export function CheckoutPaymentRoutePage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const closeCart = useCartStore((state) => state.closeCart);

  const pricing = getCartPricing(items);
  const hasItems = items.length > 0;

  const {
    increaseHandler,
    decreaseHandler,
    deleteHandler,
    confirmationDialog,
  } = useCartDrawerState({
    onRemoveItem: (item) => removeItem(item.id),
    onQuantityChange: (item, quantity) => updateQuantity(item.id, quantity),
  });

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  return (
    <>
      <CheckoutPaymentPage
        items={items}
        hasItems={hasItems}
        pricing={pricing}
        onIncrease={increaseHandler}
        onDecrease={decreaseHandler}
        onRemove={deleteHandler}
      />

      <ConfirmDialog
        open={confirmationDialog.open}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        confirmLabel="Remove Item"
        cancelLabel="Keep Item"
        onCancel={confirmationDialog.onCancel}
        onConfirm={confirmationDialog.onConfirm}
      />
    </>
  );
}
