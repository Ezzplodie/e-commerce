import Image from "next/image";
import { CloseStrokeIcon } from "@/shared/assets/icons";
import { resolveCartItemImage } from "../../lib/resolveCartItemImage";
import type { CartItemData } from "../../model/types";
import { CartQuantityControl } from "../drawer/CartQuantityControl";
import styles from "./CartPane.module.scss";

function formatItemPrice(value: number) {
  return Number.isInteger(value) ? `$ ${value}` : `$ ${value.toFixed(2)}`;
}

interface CartPaneItemProps {
  item: CartItemData;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}

export function CartPaneItem({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: CartPaneItemProps) {
  const linePrice = item.price * item.quantity;
  console.log(item);

  return (
    <li className={styles.summaryItem}>
      <div className={styles.summaryImageWrap}>
        <Image
          src={resolveCartItemImage(item.image)}
          alt=""
          aria-hidden="true"
          fill
          quality={70}
          sizes="142px"
          className={styles.summaryImage}
        />
        <span className={styles.quantityBadge}>
          {item.badgeLabel ?? item.quantity}
        </span>
      </div>

      <div className={styles.itemDetails}>
        <h3 className={styles.itemTitle}>{item.title}</h3>
        <p className={styles.itemMeta}>Size: {item.size}</p>
        <p className={styles.itemMeta}>Color: {item.color}</p>
        <CartQuantityControl
          itemName={item.title}
          quantity={item.quantity}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
          className={styles.checkoutQuantity}
        />
      </div>

      <button
        type="button"
        className={styles.removeItemButton}
        onClick={onRemove}
        aria-label={`Remove ${item.title} from cart`}
      >
        <CloseStrokeIcon width={24} height={24} aria-hidden="true" />
      </button>

      <strong className={styles.itemPrice}>{formatItemPrice(linePrice)}</strong>
    </li>
  );
}

