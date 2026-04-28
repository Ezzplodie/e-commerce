import Skeleton from "react-loading-skeleton";
import clsx from "clsx";
import styles from "./ProductCard.module.scss";

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={clsx(styles.card, className)} aria-hidden="true">
      <div className={styles.imageWrap}>
        <Skeleton height="100%" width="100%" />
      </div>

      <div className={styles.meta}>
        <div className={styles.copy}>
          <Skeleton height={14} width="70%" />
          <Skeleton height={12} width="55%" />
        </div>
        <Skeleton height={12} width={48} />
      </div>

      <div className={styles.colors}>
        <Skeleton circle width={26} height={26} />
        <Skeleton circle width={26} height={26} />
        <Skeleton circle width={26} height={26} />
      </div>
    </div>
  );
}

