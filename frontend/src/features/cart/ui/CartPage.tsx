"use client";

import Link from "next/link";
import { useEffect } from "react";
import { formatPrice } from "@/shared/lib/formatters";
import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { useCartStore } from "../model/cartStore";
import { getCartPricing } from "../model/cartPricing";
import { useCartDrawerState } from "../model/useCartDrawerState";
import { CartCheckoutItemRow } from "./CartCheckoutItemRow";
import styles from "./CartPage.module.scss";
import Header from "@/widgets/header";
import { clsx } from "clsx";

const cartPriceFormat = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
};

export function CartPage() {
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
      <Header />
      <main className={styles.page}>
        <section className={clsx(styles.panel, "container")}>
          <div className={styles.heroRow}>
            <div className={styles.heroIntro}>
              <Link href="/products" className={styles.auxiliaryLink}>
                Back
              </Link>
              <h1 className={styles.title}>Your Cart</h1>
            </div>

            <Link href="/products" className={styles.auxiliaryLink}>
              Continue Shopping
            </Link>
          </div>

          {hasItems ? (
            <>
              <div className={styles.tableHeader}>
                <span className={styles.tableHeading}>Order Summary</span>

                <div className={styles.metricHeadings}>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                </div>
              </div>

              <div className={styles.itemsList}>
                {items.map((item) => (
                  <CartCheckoutItemRow
                    key={item.id}
                    item={item}
                    onRemove={() => deleteHandler(item)}
                    onDecrease={() => decreaseHandler(item)}
                    onIncrease={() => increaseHandler(item)}
                  />
                ))}
              </div>

              <aside className={styles.summaryPanel}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>
                    Subtotal ({pricing.itemCount})
                  </span>
                  <span className={styles.summaryValue}>
                    {formatPrice(pricing.subtotal, cartPriceFormat)}
                  </span>
                </div>

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Tax</span>
                  <span className={styles.summaryValue}>
                    {formatPrice(pricing.tax, cartPriceFormat)}
                  </span>
                </div>

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Shipping</span>
                  <span className={styles.summaryValue}>
                    {pricing.shipping === 0
                      ? "Free"
                      : formatPrice(pricing.shipping, cartPriceFormat)}
                  </span>
                </div>

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Total Orders:</span>
                  <span className={styles.summaryValue}>
                    {formatPrice(pricing.total, cartPriceFormat)}
                  </span>
                </div>

                <p className={styles.summaryNote}>
                  The total amount you pay includes all applicable customs
                  duties & taxes. We guarantee no additional charges on delivery
                </p>

                <Button className={styles.nextButton}>Next</Button>
              </aside>
            </>
          ) : (
            <div className={styles.emptyState}>
              <h2 className={styles.emptyTitle}>Your Cart Is Empty</h2>
              <p className={styles.emptyDescription}>
                Add a few pieces to your bag and come back here to review your
                order.
              </p>
              <Link href="/products" className={styles.emptyAction}>
                Continue Shopping
              </Link>
            </div>
          )}
        </section>
      </main>

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
