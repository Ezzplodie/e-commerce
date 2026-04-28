import Link from "next/link";
import { formatPrice } from "@/shared/lib/formatters";
import type { CartItemData } from "../../model/types";
import styles from "./CartPane.module.scss";
import { CartPaneItem } from "./CartPaneItem";

const moneyWithCents = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
};

interface CartPaneProps {
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
  shippingState?: "calculating" | "not_selected" | "selected" | "error";
}

export function CartPane({
  items,
  hasItems,
  pricing,
  onDecrease,
  onIncrease,
  onRemove,
  shippingPrice,
  shippingState,
}: CartPaneProps) {
  const effectiveShippingState =
    shippingState ??
    (shippingPrice !== undefined ? "selected" : ("not_selected" as const));

  const displayShipping =
    effectiveShippingState === "selected"
      ? shippingPrice ?? pricing.shipping
      : undefined;

  const displayTotal =
    effectiveShippingState === "selected" && displayShipping !== undefined
      ? pricing.subtotal + pricing.tax + displayShipping
      : undefined;

  return (
    <aside className={styles.cartPane} aria-label="Your cart">
      <div className={styles.cartContent}>
        <h2 className={styles.cartTitle}>Your Cart</h2>

        {hasItems ? (
          <ul className={styles.summaryList}>
            {items.map((item) => (
              <CartPaneItem
                key={item.id}
                item={item}
                onDecrease={() => onDecrease(item)}
                onIncrease={() => onIncrease(item)}
                onRemove={() => onRemove(item)}
              />
            ))}
          </ul>
        ) : (
          <div className={styles.emptySummary}>
            <h3>Your Cart Is Empty</h3>
            <p>Add items to your cart before continuing to shipping.</p>
            <Link href="/products">Shop New In</Link>
          </div>
        )}

        {hasItems && (
          <div className={styles.totalsContainer}>
            <dl className={styles.totals}>
              <div>
                <dt>Subtotal ({pricing.itemCount})</dt>
                <dd>{formatPrice(pricing.subtotal, moneyWithCents)}</dd>
              </div>

              <div>
                <dt>Tax</dt>
                <dd>{formatPrice(pricing.tax, moneyWithCents)}</dd>
              </div>

              <div>
                <dt>Shipping</dt>
                <dd>
                  {effectiveShippingState === "calculating"
                    ? "Calculating…"
                    : effectiveShippingState === "error"
                      ? "Unavailable"
                      : effectiveShippingState === "not_selected"
                        ? "Select a method"
                        : displayShipping === 0
                          ? "Free"
                          : formatPrice(displayShipping ?? 0, moneyWithCents)}
                </dd>
              </div>

              <div className={styles.totalRow}>
                <dt>Total Orders:</dt>
                <dd>
                  {displayTotal === undefined
                    ? "—"
                    : formatPrice(displayTotal, moneyWithCents)}
                </dd>
              </div>
            </dl>
            <p className={styles.totalNote}>
              The total amount you pay includes all applicable customs duties &
              taxes. We guarantee no additional charges on delivery
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

