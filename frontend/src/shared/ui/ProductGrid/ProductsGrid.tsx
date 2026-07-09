import clsx from "clsx";
import { ProductCard, ProductCardProps } from "../ProductCard/ProductCard";
import { ProductCardSkeleton } from "../ProductCard/ProductCardSkeleton";
import styles from "./ProductsGrid.module.scss";

export type ProductGridItem = ProductCardProps & {
  key: string;
  variantId?: number;
};

type ProductGridProps = {
  items: ProductGridItem[];
  isLoading?: boolean;
  skeletonCount?: number;
  columns?: 3 | 4;
  className?: string;
};

export function ProductsGrid({
  items,
  isLoading,
  skeletonCount,
  columns = 3,
  className,
}: ProductGridProps) {
  return (
    <div
      className={clsx(
        styles.grid,
        columns === 4 && styles.gridCols4,
        className,
      )}
      aria-busy={isLoading}
    >
      {isLoading
        ? Array.from({ length: skeletonCount ?? 4 }).map((_, idx) => (
            <ProductCardSkeleton key={`skeleton-${idx}`} />
          ))
        : items.map(({ key, variantId: _variantId, ...cardProps }) => (
            <ProductCard key={key} {...cardProps} />
          ))}
    </div>
  );
}
