import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import styles from "./HomePage.module.scss";

const HERO_IMAGE =
  "https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=2400";

export function HeroSection() {
  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.heroMedia} aria-hidden="true">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroScrim} />
      </div>

      <Container className={styles.heroOuter} innerClassName={styles.heroInner}>
        <div className={styles.heroCopy}>
          <p className={styles.heroKicker}>New Season · SS&apos;26</p>
          <h1 className={styles.heroTitle}>
            Effortless essentials
            <br />
            <span className={styles.heroTitleAccent}>for every day</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Minimal silhouettes, premium fabrics, and a fit that feels made
            for you.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.heroPrimary} href="/products">
              Shop New In
              <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <Link className={styles.heroLink} href="/categories">
              Browse collection
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
