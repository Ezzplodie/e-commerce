import Link from "next/link";
import { formatPrice } from "@/shared/lib/formatters";
import type { CartItemData } from "../model/types";
import styles from "./CartPane.module.scss";
import { CartPaneItem } from "./CartPaneItem";

const moneyWithCents = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
};

function formatItemPrice(value: number) {
  return Number.isInteger(value) ? `$ ${value}` : `$ ${value.toFixed(2)}`;
}

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
}

export function CartPane({
  items,
  hasItems,
  pricing,
  onDecrease,
  onIncrease,
  onRemove,
  shippingPrice,
}: CartPaneProps) {
  const displayShipping =
    shippingPrice !== undefined ? shippingPrice : pricing.shipping;
  const displayTotal =
    shippingPrice !== undefined
      ? pricing.subtotal + pricing.tax + shippingPrice
      : pricing.total;
  console.log({ subtotal: pricing.subtotal, tax: pricing.tax, shippingPrice });
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
                  {displayShipping === 0
                    ? "Free"
                    : formatPrice(displayShipping, moneyWithCents)}
                </dd>
              </div>

              <div className={styles.totalRow}>
                <dt>Total Orders:</dt>
                <dd>{formatPrice(displayTotal, moneyWithCents)}</dd>
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
