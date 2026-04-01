import { Heart } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { formatPrice } from "@/shared/lib/formatters";
import styles from "./ProductRecommendationCard.module.scss";

type Props = {
  title: string;
  subtitle: string;
  price: number;
  image: string | StaticImageData;
  colors: string[];
};

export function ProductRecommendationCard({
  title,
  subtitle,
  price,
  image,
  colors,
}: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={image}
          alt={title}
          fill
          className={styles.image}
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) calc(50vw - 32px), 392px"
        />

        <button type="button" className={styles.wishlist} aria-label={`Save ${title}`}>
          <Heart size={16} strokeWidth={1.8} />
        </button>
      </div>

      <div className={styles.meta}>
        <div className={styles.copy}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <strong className={styles.price}>{formatPrice(price)}</strong>
      </div>

      <div className={styles.colors} aria-hidden="true">
        {colors.map((color) => (
          <span
            key={color}
            className={styles.swatch}
            style={{ backgroundColor: color, borderColor: color === "#ffffff" ? "#0c0c0c" : "transparent" }}
          />
        ))}
      </div>
    </article>
  );
}
