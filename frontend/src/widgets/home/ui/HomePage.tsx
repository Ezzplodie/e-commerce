import Footer from "@/widgets/footer";
import Header from "@/widgets/header";
import { BestSellersSection } from "./BestSellersSection";
import { BenefitsSection } from "./BenefitsSection";
import { FaqSection } from "./FaqSection";
import { HeroSection } from "./HeroSection";
import styles from "./HomePage.module.scss";

export function HomePage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <HeroSection />
        <BestSellersSection />
        <BenefitsSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}

