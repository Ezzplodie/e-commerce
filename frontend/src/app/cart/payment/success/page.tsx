"use client";

import { useEffect } from "react";
import { CheckoutHeader } from "@/widgets/checkout-header";
import styles from "./page.module.scss";
import {
  SUPPORT_EMAIL_DISPLAY,
  SUPPORT_PHONE,
} from "@/shared/constants/support";
import { useCartStore } from "@/features/cart/model/cartStore";

const SUCCESS_ICON_URL =
  "https://www.figma.com/api/mcp/asset/9a8da014-a07d-4e3f-8ae2-8e33017036e1";

export default function PaymentSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <CheckoutHeader />
      <main className={styles.page}>
        <div className={`${styles.content} container`}>
          <img
            className={styles.icon}
            src={SUCCESS_ICON_URL}
            alt=""
            aria-hidden="true"
          />

          <h1 className={styles.title}>Payment Successful</h1>

          <p className={styles.lead}>
            Thank you for choosing Modimal, Your order will be generated based on
            your delivery request.
          </p>
          <p className={styles.leadNarrow}>the Receipt has been sent to your email.</p>

          <p className={styles.contactHint}>Please Contact us for any query</p>
          <p className={styles.contactLine}>{SUPPORT_PHONE}</p>
          <p className={styles.or}>OR</p>
          <p className={styles.contactLine}>{SUPPORT_EMAIL_DISPLAY}</p>
        </div>
      </main>
    </>
  );
}

