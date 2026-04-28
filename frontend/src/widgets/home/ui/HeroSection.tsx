import Link from "next/link";
import styles from "./HomePage.module.scss";

export function HeroSection() {
  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={`${styles.heroInner} container`}>
        <div className={styles.heroCopy}>
          <p className={styles.heroKicker}>New Season</p>
          <h1 className={styles.heroTitle}>
            Effortless essentials
            <br />
            for every day
          </h1>
          <p className={styles.heroSubtitle}>
            Minimal silhouettes, premium fabrics, and a fit that feels made for you.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.heroPrimary} href="/products">
              Shop New In
            </Link>
            <Link className={styles.heroLink} href="/products">
              Explore collection
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.heroMedia} aria-hidden="true" />
    </section>
  );
}

