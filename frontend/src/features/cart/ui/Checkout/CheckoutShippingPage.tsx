"use client";

import { useState, useEffect } from "react";
import { CheckoutHeader } from "@/widgets/checkout-header";
import { getCartPricing } from "../../model/cartPricing";
import type { ShippingMethod } from "../../model/types";
import { useCartStore } from "../../model/cartStore";
import { getAllShippingMethods } from "../../api/shippingMethods";
import { formatPrice } from "@/shared/lib/formatters";
import styles from "./CheckoutShippingPage.module.scss";
import { useCartDrawerState } from "../../model/useCartDrawerState";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import type { BreadcrumbItem } from "@/shared/ui/Breadcrumbs";
import { CartPane } from "../CartPane";
import { CheckoutReturnLink } from "../CheckoutReturnLink";

const checkoutSteps: BreadcrumbItem[] = [
  { label: "Cart", href: "/cart" },
  { label: "Info", href: "/cart/information" },
  { label: "Shipping" },
  { label: "Payment" },
];

const moneyWithCents = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
};

export function CheckoutShippingPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const closeCart = useCartStore((state) => state.closeCart);

  const pricing = getCartPricing(items);
  const hasItems = items.length > 0;

  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const loadShippingMethods = async () => {
      try {
        setIsLoading(true);
        const methods = await getAllShippingMethods();
        setShippingMethods(methods);
        console.log("Loaded shipping methods:", methods);
        if (methods.length > 0) {
          setSelectedShippingMethodId(methods[0].id);
        }
      } catch (err) {
        console.error("Failed to load shipping methods:", err);
        setError("Failed to load shipping methods. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadShippingMethods();
  }, []);

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  const selectedMethod = shippingMethods.find(
    (method) => method.id === selectedShippingMethodId,
  );

  const handleShippingMethodChange = (methodId: number) => {
    setSelectedShippingMethodId(methodId);
  };
  console.log(pricing, "pricing");
  return (
    <>
      <CheckoutHeader />
      <main className={styles.page}>
        <div className={`${styles.content} container`}>
          <section
            className={styles.checkoutPane}
            aria-label="Shipping method selection"
          >
            <Breadcrumbs
              items={checkoutSteps}
              ariaLabel="Checkout progress"
              className={styles.breadcrumbs}
            />

            <h2 className={styles.sectionTitle}>Shipping Method</h2>

            {isLoading ? (
              <div className={styles.loadingMessage}>
                Loading shipping methods...
              </div>
            ) : error ? (
              <div className={styles.errorMessage}>{error}</div>
            ) : shippingMethods.length === 0 ? (
              <div className={styles.emptyMessage}>
                No shipping methods available
              </div>
            ) : (
              <div className={styles.shippingMethodsList}>
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className={styles.shippingMethodOption}
                  >
                    <input
                      type="radio"
                      name="shipping-method"
                      value={method.id}
                      checked={selectedShippingMethodId === method.id}
                      onChange={() => handleShippingMethodChange(method.id)}
                      className={styles.radioInput}
                      aria-label={`${method.name} - ${formatPrice(
                        method.price,
                        moneyWithCents,
                      )} - Estimated ${method.estimated_days}`}
                    />
                    <div className={styles.methodContent}>
                      <div className={styles.methodHeader}>
                        <span className={styles.methodName}>{method.name}</span>
                        <span className={styles.methodPrice}>
                          {formatPrice(method.price, moneyWithCents)}
                        </span>
                      </div>
                      <p className={styles.methodDetails}>
                        Estimated delivery: {method.estimated_days} days
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className={styles.actions}>
              <CheckoutReturnLink
                href="/cart/information"
                className={styles.returnLink}
              >
                ← Back
              </CheckoutReturnLink>
              <button
                className={styles.continueButton}
                disabled={!selectedMethod || !hasItems}
                aria-label="Continue to payment"
              >
                Continue
              </button>
            </div>
          </section>

          <CartPane
            items={items}
            hasItems={hasItems}
            pricing={pricing}
            onIncrease={increaseHandler}
            onDecrease={decreaseHandler}
            onRemove={deleteHandler}
            shippingPrice={selectedMethod?.price}
          />
        </div>
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
