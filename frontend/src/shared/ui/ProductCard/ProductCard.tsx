"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useMemo } from "react";
import { formatPrice } from "@/shared/lib/formatters";
import { AvailableColors } from "@/shared/ui/AvailableColors";
import styles from "./ProductCard.module.scss";

export type ProductCardProps = {
  title: string;
  subtitle?: string;
  price: number;
  image: string;
  href?: string;
  colors?: string[];
  enabledColors?: Iterable<string>;
  className?: string;
};

export function ProductCard({
  title,
  subtitle,
  price,
  image,
  href,
  colors,
  enabledColors,
  className,
}: ProductCardProps) {
  const uniqueColors = useMemo(
    () => Array.from(new Set(colors || [])),
    [colors],
  );

  const content = (
    <>
      <div className={styles.imageWrap}>
        <Image
          src={image}
          alt={title}
          fill
          className={styles.image}
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 50vw, 420px"
        />

        <button
          type="button"
          className={styles.wishlist}
          aria-label={`Save ${title}`}
        >
          <Heart size={16} strokeWidth={1.8} />
        </button>
      </div>

      <div className={styles.meta}>
        <div className={styles.copy}>
          <h3 className={styles.title}>{title}</h3>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>

        <strong className={styles.price}>{formatPrice(price)}</strong>
      </div>

      {uniqueColors.length ? (
        <AvailableColors
          variant="default"
          colors={uniqueColors}
          enabledColors={enabledColors}
          className={styles.colors}
          buttonClassName={styles.colorButton}
        />
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={clsx(styles.card, className)}>
        {content}
      </Link>
    );
  }

  return <article className={clsx(styles.card, className)}>{content}</article>;
}
