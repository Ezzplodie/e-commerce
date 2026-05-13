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

          <ul className={styles.categoriesGrid}>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className={styles.categoryCard}>
                  <span className={styles.categoryName}>{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}

