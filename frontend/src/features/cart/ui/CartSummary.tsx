"use client";

import { Button } from "@/shared/ui/Button";
import styles from "./CartSummary.module.scss";

type CartSummaryProps = {
  onCheckout: () => void;
};

export function CartSummary({ onCheckout }: CartSummaryProps) {
  return (
    <div className={styles.summary}>
      <Button className={styles.checkoutButton} onClick={onCheckout}>
        Check Out
      </Button>
    </div>
  );
}
