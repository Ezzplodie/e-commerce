"use client";

import clsx from "clsx";
import { CloseIcon } from "@/shared/assets/icons";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import type { CartItemData } from "../../model/types";
import { useCartDrawerState } from "../../model/useCartDrawerState";
import { CartEmptyState } from "./CartEmptyState";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import styles from "./CartDrawer.module.scss";

type CartDrawerProps = {
  isOpen: boolean;
  items: CartItemData[];
  onClose: () => void;
  onCheckout: () => void;
  onRemoveItem?: (item: CartItemData) => void;
  onQuantityChange?: (item: CartItemData, quantity: number) => void;
};

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onCheckout,
  onRemoveItem,
  onQuantityChange,
}: CartDrawerProps) {
  const hasItems = items.length > 0;
  const { increaseHandler, decreaseHandler, deleteHandler, confirmationDialog } =
    useCartDrawerState({
      onRemoveItem,
      onQuantityChange,
    });

  return (
    <>
      <div
        className={clsx(styles.overlay, isOpen && styles.overlayOpen)}
        onClick={onClose}
        aria-hidden={!isOpen}
        data-lock-scroll={isOpen ? "true" : undefined}
      >
        <aside
          className={clsx(
            styles.drawer,
            isOpen && styles.drawerOpen,
            !hasItems && styles.drawerEmpty,
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={hasItems ? "cart-drawer-title" : "empty-cart-title"}
          onClick={(event) => event.stopPropagation()}
        >
          {hasItems ? (
            <>
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
            </>
          ) : (
            <div className={styles.emptyStateWrap}>
              <CartEmptyState onClose={onClose} />
            </div>
          )}

          {hasItems && <CartSummary onCheckout={onCheckout} />}
        </aside>
      </div>
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

