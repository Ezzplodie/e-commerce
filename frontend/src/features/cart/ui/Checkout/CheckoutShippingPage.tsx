"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckoutHeader } from "@/widgets/checkout-header";
import { getCartPricing } from "../../model/cartPricing";
import { useCartStore } from "../../model/cartStore";
import { formatPrice } from "@/shared/lib/formatters";
import styles from "./CheckoutShippingPage.module.scss";
import { useCartDrawerState } from "../../model/useCartDrawerState";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import type { BreadcrumbItem } from "@/shared/ui/Breadcrumbs";
import { CartPane } from "./CartPane";
import { CheckoutReturnLink } from "./CheckoutReturnLink";
import { useCheckoutShipping } from "../../model/useCheckoutShipping";
import { findUserAddress } from "../../api/address";
import { createOrder } from "../../api/orders";

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
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const closeCart = useCartStore((state) => state.closeCart);
  const setCurrentOrderId = useCartStore((state) => state.setCurrentOrderId);

  const {
    shippingMethods,
    selectedMethod,
    selectedShippingMethodId,
    setSelectedShippingMethodId,
    status: shippingStatus,
    error,
  } = useCheckoutShipping();

  const pricing = getCartPricing(items);
  const hasItems = items.length > 0;

  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [createOrderError, setCreateOrderError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(shippingStatus === "loading");
  }, [shippingStatus]);

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

  const handleShippingMethodChange = (methodId: number) => {
    setSelectedShippingMethodId(methodId);
  };

  const handleContinue = async () => {
    if (!selectedMethod || !hasItems) return;

    try {
      setIsCreatingOrder(true);
      setCreateOrderError(null);
      const address = await findUserAddress();
      if (!address) {
        setCreateOrderError(
          "Please fill in your shipping address on the Info step before continuing.",
        );
        router.push("/cart/information");
        return;
      }
      const order = await createOrder({
        shipping: address,
        shippingCost: selectedMethod.price,
        items,
      });

      setCurrentOrderId(order.id);
      router.push("/cart/payment");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to create order";
      setCreateOrderError(message);
    } finally {
      setIsCreatingOrder(false);
    }
  };

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
                disabled={!selectedMethod || !hasItems || isCreatingOrder}
                aria-label="Continue to payment"
                type="button"
                onClick={handleContinue}
              >
                {isCreatingOrder ? "Creating order..." : "Continue"}
              </button>
            </div>
            {createOrderError && (
              <div className={styles.errorMessage}>{createOrderError}</div>
            )}
          </section>

          <CartPane
            items={items}
            hasItems={hasItems}
            pricing={pricing}
            onIncrease={increaseHandler}
            onDecrease={decreaseHandler}
            onRemove={deleteHandler}
            shippingPrice={selectedMethod?.price}
            shippingState={
              isLoading
                ? "calculating"
                : error
                  ? "error"
                  : selectedMethod
                    ? "selected"
                    : "not_selected"
            }
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
