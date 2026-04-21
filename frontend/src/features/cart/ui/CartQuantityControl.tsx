import clsx from "clsx";
import { MinusStrokeIcon, PlusStrokeIcon } from "@/shared/assets/icons";
import styles from "./CartQuantityControl.module.scss";

type CartQuantityControlProps = {
  itemName: string;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  className?: string;
};

export function CartQuantityControl({
  itemName,
  quantity,
  onDecrease,
  onIncrease,
  className,
}: CartQuantityControlProps) {
  return (
    <div
      className={clsx(styles.root, className)}
      aria-label={`${itemName} quantity`}
    >
      <button
        type="button"
        className={styles.button}
        onClick={onDecrease}
        aria-label={`Decrease quantity for ${itemName}`}
      >
        <MinusStrokeIcon width={24} height={24} aria-hidden="true" />
      </button>
      <span className={styles.value}>{quantity}</span>
      <button
        type="button"
        className={styles.button}
        onClick={onIncrease}
        aria-label={`Increase quantity for ${itemName}`}
      >
        <PlusStrokeIcon width={24} height={24} aria-hidden="true" />
      </button>
    </div>
  );
}
