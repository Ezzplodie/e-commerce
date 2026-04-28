"use client";
import Image from "next/image";
import { CloseIcon } from "@/shared/assets/icons";
import { formatPrice } from "@/shared/lib/formatters";
import { resolveCartItemImage } from "../../lib/resolveCartItemImage";
import type { CartItemData } from "../../model/types";
import { CartQuantityControl } from "./CartQuantityControl";
import styles from "./CartItem.module.scss";

type CartItemProps = {
  item: CartItemData;
  onRemove: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function CartItem({
  item,
  onRemove,
  onDecrease,
  onIncrease,
}: CartItemProps) {
  return (
    <article className={styles.cartItem}>
      <div className={styles.imageWrapper}>
        <Image
          src={resolveCartItemImage(item.image)}
          alt={item.title}
          width={80}
          height={100}
          quality={60}
          className={styles.image}
        />
        <span className={styles.badge}>{item.badgeLabel ?? item.quantity}</span>
      </div>

      <div className={styles.details}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.meta}>Size: {item.size}</p>
        <p className={styles.meta}>Color: {item.color}</p>

        <CartQuantityControl
          className={styles.quantityControl}
          itemName={item.title}
          quantity={item.quantity}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />
      </div>

      <div className={styles.sideColumn}>
        <button
          type="button"
          className={styles.removeButton}
          onClick={onRemove}
          aria-label={`Remove ${item.title} from cart`}
        >
          <CloseIcon width={24} height={24} />
        </button>

        <p className={styles.price}>
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </article>
  );
}

