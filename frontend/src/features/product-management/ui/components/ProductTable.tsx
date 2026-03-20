"use client";

import { Product } from "@/entities/product/types";
import { Button } from "@/shared/ui/Button";
import styles from "../ProductList.module.scss";

type ProductTableProps = {
  products: Product[];
  onEdit: (slug: string) => void | Promise<void>;
  onDelete: (slug: string) => void | Promise<void>;
};

export const ProductTable = ({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) => {
  return (
    <div className={styles.table}>
      <div className={styles.tableHead}>
        <span>Name</span>
        <span>Category</span>
        <span>Base Price</span>
        <span>Variants</span>
        <span>Stock</span>
        <span>Slug</span>
        <span>Actions</span>
      </div>

      {products.map((product) => {
        const basePrice = Number(product.base_price) || 0;
        const name = product.name || "Untitled product";
        const categoryName = product.category_name || "Uncategorized";
        const slug = product.slug || "-";
        const variants = Number(product.variant_count) || 0;
        const totalStock = Number(product.total_stock) || 0;

        return (
          <article key={product.id ?? slug} className={styles.row}>
            <span className={styles.name}>{name}</span>
            <span>{categoryName}</span>
            <span>${basePrice.toFixed(2)}</span>
            <span>{variants}</span>
            <span>{totalStock}</span>
            <span className={styles.slug}>{slug}</span>
            <div className={styles.rowActions}>
              <Button className={styles.editButton} onClick={() => onEdit(slug)}>
                Edit
              </Button>
              <Button
                className={styles.deleteButton}
                onClick={() => onDelete(slug)}
              >
                Delete
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
};
