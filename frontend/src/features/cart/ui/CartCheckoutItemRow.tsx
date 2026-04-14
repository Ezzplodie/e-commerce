import clsx from "clsx";
import Image from "next/image";
import { CloseIcon } from "@/shared/assets/icons";
import { formatPrice } from "@/shared/lib/formatters";
import type { CartItemData } from "../model/types";
import { resolveCartItemImage } from "../lib/resolveCartItemImage";
import { CartQuantityControl } from "./CartQuantityControl";
import styles from "./CartCheckoutItemRow.module.scss";

const cartPriceFormat = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
};

type CartCheckoutItemRowProps = {
  item: CartItemData;
  onRemove: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function CartCheckoutItemRow({
  item,
  onRemove,
  onDecrease,
  onIncrease,
}: CartCheckoutItemRowProps) {
  return (
    <li className={styles.row}>
      <div className={styles.productCell}>
        <div className={styles.imageWrapper}>
          <Image
            src={resolveCartItemImage(item.image)}
            alt=""
            aria-hidden="true"
            fill
            quality={60}
            sizes="(max-width: 767px) 112px, 136px"
            className={styles.image}
          />
        </div>

        <div className={styles.details}>
          <strong className={styles.title}>{item.title}</strong>
          <div className={styles.meta}>Size: {item.size}</div>
          <div className={styles.meta}>Color: {item.color}</div>
        </div>

        <button
          type="button"
          className={styles.removeButton}
          onClick={onRemove}
          aria-label={`Remove ${item.title} from cart`}
        >
          <CloseIcon width={24} height={24} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.metrics}>
        <div className={clsx(styles.dataCell, styles.priceCell)}>
          <span className={styles.mobileLabel} aria-hidden="true">
            Price
          </span>
          <span className={styles.value}>
            {formatPrice(item.price, cartPriceFormat)}
          </span>
        </div>

        <div className={clsx(styles.dataCell, styles.quantityCell)}>
          <span className={styles.mobileLabel} aria-hidden="true">
            Quantity
          </span>
          <CartQuantityControl
            itemName={item.title}
            quantity={item.quantity}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
          />
        </div>

        <div className={clsx(styles.dataCell, styles.totalCell)}>
          <span className={styles.mobileLabel} aria-hidden="true">
            Total
          </span>
          <span className={styles.value}>
            {formatPrice(item.price * item.quantity, cartPriceFormat)}
          </span>
        </div>
      </div>
    </li>
  );
}
