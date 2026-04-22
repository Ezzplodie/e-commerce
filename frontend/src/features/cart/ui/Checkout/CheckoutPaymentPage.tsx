"use client";

import { CheckoutHeader } from "@/widgets/checkout-header";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import type { BreadcrumbItem } from "@/shared/ui/Breadcrumbs";
import { CartPane } from "../CartPane";
import styles from "./CheckoutPaymentPage.module.scss";
import type { CartItemData } from "../../model/types";
import { PaymentForm } from "./PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/shared/lib/stripe";

const checkoutSteps: BreadcrumbItem[] = [
  { label: "Cart", href: "/cart" },
  { label: "Info", href: "/cart/information" },
  { label: "Shipping", href: "/cart/shipping" },
  { label: "Payment" },
];

type CheckoutPaymentPageProps = {
  items: CartItemData[];
  hasItems: boolean;
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    itemCount: number;
  };
  onDecrease: (item: CartItemData) => void;
  onIncrease: (item: CartItemData) => void;
  onRemove: (item: CartItemData) => void;
  shippingPrice?: number;
};

export function CheckoutPaymentPage(props: CheckoutPaymentPageProps) {
  const {
    items,
    hasItems,
    pricing,
    onDecrease,
    onIncrease,
    onRemove,
    shippingPrice,
  } = props;

  return (
    <>
      <CheckoutHeader />
      <main className={styles.page}>
        <div className={`${styles.content} container`}>
          <section className={styles.checkoutPane} aria-label="Payment details">
            <Breadcrumbs
              items={checkoutSteps}
              ariaLabel="Checkout progress"
              className={styles.breadcrumbs}
            />

            <h2 className={styles.sectionTitle}>
              Please Choose Your Payment Method
            </h2>

            <div
              className={styles.paymentsRow}
              aria-label="Supported payment methods"
            >
              <span className={styles.brandChip}>AMEX</span>
              <span className={styles.brandChip}>VISA</span>
              <span className={styles.brandChip}>MASTERCARD</span>
              <span className={styles.brandChip}>PAYPAL</span>
            </div>
            <Elements stripe={stripePromise}>
              <PaymentForm hasItems={hasItems} returnHref="/cart/shipping" />
            </Elements>
          </section>

          <CartPane
            items={items}
            hasItems={hasItems}
            pricing={pricing}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onRemove={onRemove}
            shippingPrice={shippingPrice}
          />
        </div>
      </main>
    </>
  );
}
