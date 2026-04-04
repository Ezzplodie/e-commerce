"use client";

import { useState } from "react";
import clsx from "clsx";
import { CloseIcon } from "@/shared/assets/icons";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import type { CartItemData } from "../model/types";
import styles from "./CartDrawer.module.scss";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";

type CartDrawerProps = {
  isOpen: boolean;
  items: CartItemData[];
  onClose: () => void;
  onCheckout: () => void;
  onRemoveItem?: (item: CartItemData) => void;
  onQuantityChange?: (item: CartItemData, quantity: number) => void;
};

type ConfirmState = {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
};

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onCheckout,
  onRemoveItem,
  onQuantityChange,
}: CartDrawerProps) {
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
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  const increaseHandler = (item: CartItemData) => {
    onQuantityChange?.(item, item.quantity + 1);
  };
  const decreaseHandler = (item: CartItemData) => {
    if (item.quantity === 1) {
      confirmRemove(item);
    } else {
      onQuantityChange?.(item, item.quantity - 1);
    }
  };
  const deleteHandler = (item: CartItemData) => {
    confirmRemove(item);
  };

  return (
    <>
      <div
        className={clsx(styles.overlay, isOpen && styles.overlayOpen)}
        onClick={onClose}
        aria-hidden={!isOpen}
        data-lock-scroll={isOpen ? "true" : undefined}
      >
        <aside
          className={clsx(styles.drawer, isOpen && styles.drawerOpen)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          onClick={(event) => event.stopPropagation()}
        >
          <div className={styles.header}>
            <h2 id="cart-drawer-title" className={styles.title}>
              Your Cart
            </h2>

            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close cart"
            >
              <CloseIcon width={24} height={24} />
            </button>
          </div>

          <div className={styles.itemsList}>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={() => deleteHandler(item)}
                onDecrease={() => decreaseHandler(item)}
                onIncrease={() => increaseHandler(item)}
              />
            ))}
          </div>

          <CartSummary onCheckout={onCheckout} />
        </aside>
      </div>
      <ConfirmDialog
        open={confirmState !== null}
        title={confirmState?.title || ""}
        message={confirmState?.message || ""}
        confirmLabel="Remove Item"
        cancelLabel="Keep Item"
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirmRemove}
      />
    </>
  );
}
