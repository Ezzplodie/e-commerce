import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./HomePage.module.scss";

const EDITORIAL_IMAGE =
  "https://images.pexels.com/photos/2106685/pexels-photo-2106685.jpeg?auto=compress&cs=tinysrgb&w=1800";

export function EditorialSection() {
  return (
    <section className={styles.editorial} aria-label="The Spring Edit">
      <div className={styles.editorialGrid}>
        <div className={styles.editorialMedia}>
          <Image
            src={EDITORIAL_IMAGE}
            alt="Model wearing pieces from the Spring Edit collection"
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className={styles.editorialImage}
          />
        </div>

        <div className={styles.editorialContent}>
          <div className={styles.editorialCopy}>
            <p className={styles.editorialKicker}>The Spring Edit</p>
            <h2 className={styles.editorialTitle}>
              Made to layer.
              <br />
              Worn every way.
            </h2>
            <p className={styles.editorialBody}>
              Twenty‑four new pieces designed for the in‑between season —
              fluid silhouettes, breathable fabrics, and tones that pair with
              everything already in your wardrobe.
            </p>
            <Link className={styles.editorialCta} href="/products">
              Explore the edit
              <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
