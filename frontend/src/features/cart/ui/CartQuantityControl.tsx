import clsx from "clsx";
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
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 11H18V13H6V11Z" fill="#404E3E" />
        </svg>
      </button>
      <span className={styles.value}>{quantity}</span>
      <button
        type="button"
        className={styles.button}
        onClick={onIncrease}
        aria-label={`Increase quantity for ${itemName}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#404E3E" />
        </svg>
      </button>
    </div>
  );
}
