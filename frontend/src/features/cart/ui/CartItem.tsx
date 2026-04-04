"use client";

import type { StaticImageData } from "next/image";
import { plusSizeImage } from "@/shared/assets/images";
import { CloseIcon } from "@/shared/assets/icons";
import { formatPrice } from "@/shared/lib/formatters";
import type { CartItemData } from "../model/types";
import styles from "./CartItem.module.scss";

type CartItemProps = {
  item: CartItemData;
  onRemove: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
};

function resolveImageSource(image?: string | StaticImageData | null) {
  if (!image) {
    return plusSizeImage.src;
  }

  return typeof image === "string" ? image || plusSizeImage.src : image.src;
}

/**
 * Single cart line item with quantity controls, price, and remove affordance.
 */
export function CartItem({
  item,
  onRemove,
  onDecrease,
  onIncrease,
}: CartItemProps) {
  console.log(item);
  return (
    <article className={styles.cartItem}>
      <div className={styles.imageWrapper}>
        {/* Cart items may come from backend or static sources, so we keep the image source flexible here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolveImageSource(item.image)}
          alt={item.title}
          className={styles.image}
        />
        <span className={styles.badge}>{item.badgeLabel ?? item.quantity}</span>
      </div>

      <div className={styles.details}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.meta}>Size: {item.size}</p>
        <p className={styles.meta}>Color: {item.color}</p>

        <div className={styles.quantity} aria-label={`${item.title} quantity`}>
          <button
            type="button"
            className={styles.quantityButton}
            onClick={onDecrease}
            aria-label={`Decrease quantity for ${item.title}`}
          >
            -
          </button>
          <span className={styles.quantityValue}>{item.quantity}</span>
          <button
            type="button"
            className={styles.quantityButton}
            onClick={onIncrease}
            aria-label={`Increase quantity for ${item.title}`}
          >
            +
          </button>
        </div>
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
