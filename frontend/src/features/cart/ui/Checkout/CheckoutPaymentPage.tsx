"use client";

import { CheckoutHeader } from "@/widgets/checkout-header";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import type { BreadcrumbItem } from "@/shared/ui/Breadcrumbs";
import styles from "./CheckoutPaymentPage.module.scss";
import { PaymentForm } from "./PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/shared/lib/stripe";
import { formatPrice } from "@/shared/lib/formatters";
import {
  AmericanExpressIcon,
  MastercardIcon,
  PaypalIcon,
  VisaIcon,
} from "@/shared/assets/icons";

const checkoutSteps: BreadcrumbItem[] = [
  { label: "Cart", href: "/cart" },
  { label: "Info", href: "/cart/information" },
  { label: "Shipping", href: "/cart/shipping" },
  { label: "Payment" },
];

type CheckoutPaymentPageProps = {
  clientSecret: string | null;
  hasItems: boolean;
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    itemCount: number;
  };
  shippingPrice?: number;
};

const moneyWithCents = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
};

export function CheckoutPaymentPage(props: CheckoutPaymentPageProps) {
  const { clientSecret, hasItems, pricing, shippingPrice } = props;
  const shipping = shippingPrice ?? pricing.shipping;
  const total = pricing.subtotal + pricing.tax + shipping;

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
              <span className={styles.brandChip} aria-label="American Express">
                <AmericanExpressIcon className={styles.brandIcon} aria-hidden />
              </span>
              <span className={styles.brandChip} aria-label="Visa">
                <VisaIcon className={styles.brandIcon} aria-hidden />
              </span>
              <span className={styles.brandChip} aria-label="Mastercard">
                <MastercardIcon className={styles.brandIcon} aria-hidden />
              </span>
              <span className={styles.brandChip} aria-label="PayPal">
                <PaypalIcon className={styles.brandIcon} aria-hidden />
              </span>
            </div>

            <div className={styles.checkoutColumns}>
              <div className={styles.leftColumn}>
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm
                      clientSecret={clientSecret}
                      hasItems={hasItems}
                      returnHref="/cart/shipping"
                    />
                  </Elements>
                ) : (
                  <div>Loading payment details...</div>
                )}
              </div>

              <aside className={styles.rightColumn} aria-label="Order total">
                <section className={styles.summaryCard}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Subtotal</span>
                    <span className={styles.summaryValue}>
                      {formatPrice(pricing.subtotal, moneyWithCents)}
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Shipping</span>
                    <span className={styles.summaryValue}>
                      {formatPrice(shipping, moneyWithCents)}
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Tax</span>
                    <span className={styles.summaryValue}>
                      {formatPrice(pricing.tax, moneyWithCents)}
                    </span>
                  </div>

                  <div className={styles.summaryDivider} />

                  <div className={styles.summaryTotalRow}>
                    <span className={styles.summaryTotalLabel}>Total</span>
                    <span className={styles.summaryTotalValue}>
                      {formatPrice(total, moneyWithCents)}
                    </span>
                  </div>
                </section>
              </aside>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
