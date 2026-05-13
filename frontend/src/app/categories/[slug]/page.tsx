import { getCategoryBySlug } from "@/entities/category";
import { ProductsPageClient } from "@/widgets/products/ui/ProductsPageClient";
import { CategoryQuerySync } from "./ui/CategoryQuerySync";
import { Suspense } from "react";
import styles from "./page.module.scss";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  return (
    <>
      <Suspense fallback={null}>
        <CategoryQuerySync slug={category.slug} />
        <ProductsPageClient
          showHeaderFooter
          topSlot={
            <div className={`${styles.categoryHeader} container`}>
              <h1 className={styles.categoryTitle}>{category.name}</h1>
            </div>
          }
        />
      </Suspense>
    </>
  );
}

