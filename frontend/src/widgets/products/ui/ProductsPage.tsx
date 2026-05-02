import { ProductFilters } from "@/widgets/product-filters";
import styles from "./ProductsPage.module.scss";
import { ProductsList } from "./ProductsList";
export function ProductsPage() {
  return (
    <>
      <main className={styles.page}>
        <div className={`${styles.container} container`}>
          <aside className={styles.filters}>
            <ProductFilters />
          </aside>
          <section className={styles.content} aria-label="Products">
            <ProductsList />
          </section>
        </div>
      </main>
    </>
  );
}
