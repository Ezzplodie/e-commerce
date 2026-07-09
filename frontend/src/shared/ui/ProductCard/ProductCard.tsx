"use client";

import clsx from "clsx";
import Image from "next/image";

import { useMemo, type ReactNode } from "react";
import { formatPrice } from "@/shared/lib/formatters";
import { resolveProductCardImage } from "@/shared/lib/resolveProductCardImage";
import { AvailableColors } from "@/shared/ui/AvailableColors";
import styles from "./ProductCard.module.scss";
import Link from "next/link";

export type ProductCardProps = {
  title: string;
  subtitle?: string;
  price: number;
  image: string;
  href?: string;
  colors?: string[];
  enabledColors?: Iterable<string>;
  selectedColor?: string;
  className?: string;
  imageAction?: ReactNode;
};

export function ProductCard({
  title,
  subtitle,
  price,
  image,
  href,
  colors,
  enabledColors,
  selectedColor,
  className,
  imageAction,
}: ProductCardProps) {
  const uniqueColors = useMemo(
    () => Array.from(new Set(colors || [])),
    [colors],
  );
  const showInlineSelectedColor = Boolean(selectedColor);
  const imageSrc = resolveProductCardImage(image);

  const imageBlock = (
    <div className={styles.imageWrap}>
      {href ? (
        <Link href={href} className={styles.imageLink} aria-label={title}>
          <Image
            src={imageSrc}
            alt={title}
            fill
            className={styles.image}
            sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 50vw, 420px"
          />
        </Link>
      ) : (
        <Image
          src={imageSrc}
          alt={title}
          fill
          className={styles.image}
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 50vw, 420px"
        />
      )}

      {imageAction}
    </div>
  );

  const infoBlock = (
    <div className={styles.info}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <strong className={styles.price}>{formatPrice(price)}</strong>
      </div>

      {(subtitle || uniqueColors.length > 0) && (
        <div
          className={clsx(
            styles.details,
            showInlineSelectedColor && styles.detailsInline,
          )}
        >
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>
      )}
    </div>
  );

  const colorsBlock =
    uniqueColors.length > 0 ? (
      <AvailableColors
        variant="default"
        colors={uniqueColors}
        selectedColor={selectedColor}
        enabledColors={enabledColors}
        className={styles.colors}
        buttonClassName={styles.colorButton}
        href={href}
      />
    ) : null;

  if (href) {
    return (
      <div className={clsx(styles.cardWrapper, className)}>
        {imageBlock}
        <Link href={href} className={styles.cardLink}>
          {infoBlock}
        </Link>
        {colorsBlock}
      </div>
    );
  }

  return (
    <article className={clsx(styles.card, className)}>
      {imageBlock}
      {infoBlock}
      {colorsBlock}
    </article>
  );
}
