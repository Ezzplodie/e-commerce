"use client";

import { Button } from "@/shared/ui/Button";
import { SelectInput, TextInput } from "@/shared/ui/Input";
import { CheckoutReturnLink } from "../CheckoutReturnLink";
import styles from "./CheckoutPaymentPage.module.scss";

interface PaymentFormProps {
  hasItems: boolean;
  returnHref: string;
}

export function PaymentForm({ hasItems, returnHref }: PaymentFormProps) {
  return (
    <form className={styles.form} aria-label="Payment form">
      <div className={styles.fieldRow}>
        <label className={styles.label} htmlFor="card-number">
          Card Number*
        </label>
        <TextInput
          id="card-number"
          placeholder="Card number"
          inputMode="numeric"
          autoComplete="cc-number"
        />
      </div>

      <div className={styles.fieldRow}>
        <span className={styles.label}>Expiry Date*</span>
        <div className={styles.expiryGrid}>
          <SelectInput aria-label="Expiry month" defaultValue="">
            <option value="" disabled>
              Month
            </option>
            <option value="01">01</option>
            <option value="02">02</option>
            <option value="03">03</option>
            <option value="04">04</option>
            <option value="05">05</option>
            <option value="06">06</option>
            <option value="07">07</option>
            <option value="08">08</option>
            <option value="09">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </SelectInput>
          <SelectInput aria-label="Expiry year" defaultValue="">
            <option value="" disabled>
              Year
            </option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
            <option value="2030">2030</option>
            <option value="2031">2031</option>
            <option value="2032">2032</option>
            <option value="2033">2033</option>
            <option value="2034">2034</option>
            <option value="2035">2035</option>
            <option value="2036">2036</option>
          </SelectInput>
        </div>
      </div>

      <div className={styles.fieldRow}>
        <label className={styles.label} htmlFor="security-code">
          Security Code*
        </label>
        <div>
          <TextInput
            id="security-code"
            placeholder="CVV"
            inputMode="numeric"
            autoComplete="cc-csc"
          />
          <div className={styles.securityHelp}>
            <span aria-hidden="true">i</span>
            <a href="#security-code-help">What Is This?</a>
          </div>
        </div>
      </div>

      <Button type="button" className={styles.payButton} disabled={!hasItems}>
        Pay And Place Order
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

