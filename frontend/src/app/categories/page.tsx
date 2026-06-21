import Link from "next/link";
import Header from "@/widgets/header";
import Footer from "@/widgets/footer";
import { getCategories } from "@/entities/category";
import styles from "./page.module.scss";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className="container">
          <h1 className={styles.title}>Categories</h1>

          {categories.length === 0 ? (
            <div className={styles.emptyState} role="status">
              <h2 className={styles.emptyTitle}>No categories yet</h2>
              <p className={styles.emptyBody}>
                Categories will appear here once they are added to the store.
              </p>
            </div>
          ) : (
            <ul className={styles.categoriesGrid}>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/categories/${c.slug}`} className={styles.categoryCard}>
                    <span className={styles.categoryName}>{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

