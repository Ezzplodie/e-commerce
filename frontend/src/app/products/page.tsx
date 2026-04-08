import Footer from "@/widgets/footer/ui/Footer";
import Header from "@/widgets/header";
import { ProductFilters } from "@/widgets/product-filters";

import styles from "./ProductsPage.module.scss";

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={`${styles.container} container`}>
          <aside className={styles.filters}>
            <ProductFilters />
          </aside>
          <section className={styles.content} aria-label="Products">
            <div className={styles.productsPlaceholder}>
              <div className={styles.productsPlaceholderTitle}>Products</div>
              <div className={styles.productsPlaceholderBody}>
                Product grid goes here. (Filters UI only — no logic yet.)
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
