"use client";

import { CloseIcon } from "@/shared/assets/icons";
import { Button } from "@/shared/ui/Button";
import styles from "./CartEmptyState.module.scss";

const emptyCartActions = [
  {
    id: "collection",
    label: "Collection",
    onClick: () => console.log("open collection"),
  },
  {
    id: "new-in",
    label: "New In",
    onClick: () => console.log("open new in"),
  },
  {
    id: "best-sellers",
    label: "Best Sellers",
    onClick: () => console.log("open best sellers"),
  },
];

type CartEmptyStateProps = {
  onClose: () => void;
};

export function CartEmptyState({ onClose }: CartEmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close cart"
      >
        <CloseIcon width={24} height={24} />
      </button>

      <div className={styles.copy}>
        <h3 id="empty-cart-title" className={styles.title}>
          Your Shopping Bag Is Empty
        </h3>

        <p className={styles.description}>
          <span className={styles.descriptionLine}>Discover Modimal</span>
          <span className={styles.descriptionLine}>
            And Add Products To Your Bag
          </span>
        </p>
      </div>

      <div className={styles.actions}>
        {emptyCartActions.map((action) => (
          <Button
            key={action.id}
            className={styles.actionButton}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
