import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import type { Category } from "@/entities/category";
import styles from "./CategoriesSection.module.scss";

const CATEGORY_IMAGES = [
  "https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.pexels.com/photos/972804/pexels-photo-972804.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=1400",
];

interface Props {
  categories: Category[];
}

export function CategoriesSection({ categories }: Props) {
  const featured = categories.slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className={styles.categories} aria-label="Shop by category">
      <Container>
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionKicker}>Shop by category</p>
            <h2 className={styles.sectionTitle}>Find your fit</h2>
          </div>
          <Link className={styles.sectionLink} href="/categories">
            View all categories
          </Link>
        </header>

        <ul className={styles.categoryGrid}>
          {featured.map((category, idx) => (
            <li key={category.id} className={styles.categoryCard}>
              <Link
                href={`/categories/${category.slug}`}
                className={styles.categoryLink}
              >
                <div className={styles.categoryMedia}>
                  <Image
                    src={CATEGORY_IMAGES[idx % CATEGORY_IMAGES.length]}
                    alt=""
                    fill
                    sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 50vw, 440px"
                    className={styles.categoryImage}
                  />
                  <span className={styles.categoryOverlay} />
                </div>
                <div className={styles.categoryFooter}>
                  <span className={styles.categoryName}>{category.name}</span>
                  <span className={styles.categoryCta}>
                    Shop now
                    <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
