import Footer from "@/widgets/footer";
import Header from "@/widgets/header";
import { getCategories } from "@/entities/category";
import { getProducts } from "@/entities/product/api";
import type { Category } from "@/entities/category";
import type { ProductListItem } from "@/entities/product/types";
import { BestSellersSection } from "./BestSellersSection";
import { BenefitsSection } from "./BenefitsSection";
import { CategoriesSection } from "./CategoriesSection";
import { EditorialSection } from "./EditorialSection";
import { FaqSection } from "./FaqSection";
import { HeroSection } from "./HeroSection";
import { TrustStrip } from "./TrustStrip";
import styles from "./HomePage.module.scss";

async function loadHomeData(): Promise<{
  categories: Category[];
  bestSellers: ProductListItem[];
}> {
  const [categoriesRes, productsRes] = await Promise.allSettled([
    getCategories(),
    getProducts(8, 1),
  ]);

  return {
    categories:
      categoriesRes.status === "fulfilled" ? categoriesRes.value : [],
    bestSellers:
      productsRes.status === "fulfilled"
        ? productsRes.value.products ?? []
        : [],
  };
}

export async function HomePage() {
  const { categories, bestSellers } = await loadHomeData();

  return (
    <>
      <Header />
      <main className={styles.page}>
        <HeroSection />
        <TrustStrip />
        <CategoriesSection categories={categories} />
        <BestSellersSection products={bestSellers} />
        <EditorialSection />
        <BenefitsSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
