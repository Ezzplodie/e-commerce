import styles from "./ProductsPage.module.scss";
import { ProductsPageClient } from "./ProductsPageClient";

export function ProductsPage() {
  return (
    <>
      <div className={styles.page}>
        <ProductsPageClient />
      </div>
    </>
  );
}
