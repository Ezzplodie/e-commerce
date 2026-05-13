"use client";

import Link from "next/link";
import { CheckoutHeader } from "@/widgets/checkout-header";
import { Button } from "@/shared/ui/Button";
import styles from "./page.module.scss";
import { ChevronLeftIcon } from "@/shared/assets/icons";

const ERROR_ICON_SRC = "/payment-error.svg";

export default function PaymentErrorPage() {
  return (
    <>
      <CheckoutHeader />
      <main className={styles.page}>
        <div className={`${styles.content} container`}>
          <img
            className={styles.icon}
            src={ERROR_ICON_SRC}
            alt=""
            width={65}
            height={65}
            aria-hidden="true"
          />

          <h1 className={styles.title}>Sorry, Payment failed</h1>

          <div className={styles.message}>
            <p>Unfortunately, your order Cannot Be Completed.</p>
            <p>
              Please ensure that the billing address you provided is the same
              one where your debit/credit card is registered.
            </p>
            <p>Alternatively, please try a different payment method.</p>
          </div>

          <div className={styles.actions}>
            <Link href="/cart/payment" className={styles.payNow}>
              <Button className={styles.payNow} type="button">
                Pay Now
              </Button>
            </Link>

            <Link href="/cart" className={styles.backLink}>
              <ChevronLeftIcon className={styles.backIcon} aria-hidden />
              Back to My Orders
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
