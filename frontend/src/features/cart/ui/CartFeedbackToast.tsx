"use client";

import Image from "next/image";
import { CheckCircle2, ShoppingBag, X } from "lucide-react";
import { formatPrice } from "@/shared/lib/formatters";
import { Button } from "@/shared/ui/Button";
import { useCartFeedbackToast } from "../model/useCartFeedbackToast";
import styles from "./CartFeedbackToast.module.scss";

export function CartFeedbackToast() {
  const { feedback, onDismiss, addedLabel, totalLabel, handleViewCart } =
    useCartFeedbackToast();

  if (!feedback) {
    return null;
  }

  const { item } = feedback;

  return (
    <div
      className={styles.toast}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <button
        type="button"
        className={styles.dismissButton}
        onClick={onDismiss}
        aria-label="Dismiss cart notification"
      >
        <X size={16} strokeWidth={1.9} />
      </button>

      <div className={styles.media} aria-hidden="true">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="72px"
            className={styles.image}
          />
        ) : (
          <div className={styles.mediaFallback}>
            <ShoppingBag size={22} strokeWidth={1.8} />
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.eyebrow}>
          <CheckCircle2 size={16} strokeWidth={1.9} />
          <span>{addedLabel}</span>
        </div>

        <div className={styles.headerRow}>
          <p className={styles.title}>{item.title}</p>
          <span className={styles.price}>{formatPrice(item.price)}</span>
        </div>

        <p className={styles.meta}>
          <span>{item.color}</span>
          <span aria-hidden="true">/</span>
          <span>{item.size}</span>
        </p>

        <p className={styles.caption}>{totalLabel}</p>

        <div className={styles.actions}>
          <Button className={styles.secondaryAction} onClick={onDismiss}>
            Continue shopping
          </Button>

          <Button className={styles.primaryAction} onClick={handleViewCart}>
            View Cart
          </Button>
        </div>
      </div>

      <span className={styles.progress} aria-hidden="true" />
    </div>
  );
}
