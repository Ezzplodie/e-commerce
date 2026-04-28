"use client";

import Link from "next/link";
import { useEffect } from "react";
import { formatPrice } from "@/shared/lib/formatters";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { CheckoutHeader } from "@/widgets/checkout-header";
import { useCartStore } from "../../model/cartStore";
import { getCartPricing } from "../../model/cartPricing";
import { useCartDrawerState } from "../../model/useCartDrawerState";
import { CartCheckoutItemRow } from "./CartCheckoutItemRow";
import styles from "./CartPage.module.scss";
import { clsx } from "clsx";
import { useCheckoutShipping } from "../../model/useCheckoutShipping";

const cartPriceFormat = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
};

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const closeCart = useCartStore((state) => state.closeCart);
  const { selectedMethod, status: shippingStatus } = useCheckoutShipping();
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

  const displayShipping =
    shippingStatus === "ready" && selectedMethod ? selectedMethod.price : undefined;

  const displayTotal =
    displayShipping !== undefined
      ? pricing.subtotal + pricing.tax + displayShipping
      : undefined;

  return (
    <>
      <CheckoutHeader />
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
                    {shippingStatus === "loading"
                      ? "Calculating…"
                      : shippingStatus === "error"
                        ? "Unavailable"
                        : displayShipping === 0
                          ? "Free"
                          : displayShipping !== undefined
                            ? formatPrice(displayShipping, cartPriceFormat)
                            : "Select a method"}
                  </span>
                </div>

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Total Orders:</span>
                  <span className={styles.summaryValue}>
                    {displayTotal === undefined
                      ? "—"
                      : formatPrice(displayTotal, cartPriceFormat)}
                  </span>
                </div>

                <p className={styles.summaryNote}>
                  The total amount you pay includes all applicable customs
                  duties & taxes. We guarantee no additional charges on delivery
                </p>

                <Link href="/cart/information" className={styles.nextButton}>
                  Next
                </Link>
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

