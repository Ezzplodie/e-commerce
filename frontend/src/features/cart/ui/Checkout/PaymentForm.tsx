"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/Button";
import { CheckoutReturnLink } from "./CheckoutReturnLink";
import styles from "./CheckoutPaymentPage.module.scss";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

interface PaymentFormProps {
  clientSecret: string;
  hasItems: boolean;
  returnHref: string;
}

export function PaymentForm({
  clientSecret,
  hasItems,
  returnHref,
}: PaymentFormProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canPay = Boolean(hasItems && stripe && elements && clientSecret);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        const message = result.error.message ?? "Payment failed";
        setError(message);
        router.push("/cart/payment/error");
        return;
      }

      router.push("/cart/payment/success");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Payment failed";
      setError(message);
      router.push("/cart/payment/error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={styles.form}
      aria-label="Payment form"
      onSubmit={handleSubmit}
    >
      <div className={styles.fieldRow}>
        <label className={styles.label}>Card Details*</label>
        <div
          data-invalid={error ? "true" : "false"}
          className={styles.cardElementWrapper}
        >
          <CardElement
            options={{
              hidePostalCode: true,
              iconStyle: "solid",
              style: {
                base: {
                  fontFamily:
                    "Montserrat, system-ui, -apple-system, Segoe UI, sans-serif",
                  fontSize: "18px",
                  fontWeight: "400",
                  color: "#0c0c0c",
                  fontSmoothing: "antialiased",
                  lineHeight: "24px",
                  iconColor: "#5a6d57",

                  "::placeholder": {
                    color: "#606060",
                  },
                },
                invalid: {
                  color: "#c30000",
                  iconColor: "#c30000",
                },
              },
            }}
          />
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <Button
        type="submit"
        className={styles.payButton}
        disabled={!canPay || isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Pay And Place Order"}
      </Button>

      <p className={styles.finePrint}>
        By clicking on &quot;Pay And Place Order&quot;, you agree to the{" "}
        <a href="/terms-of-sale">Terms of Sale</a> and{" "}
        <a href="/privacy-policy">Privacy Policy</a>.
      </p>

      <div className={styles.actions}>
        <CheckoutReturnLink href={returnHref} className={styles.returnLink}>
          ← Back
        </CheckoutReturnLink>
      </div>
    </form>
  );
}
