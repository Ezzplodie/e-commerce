"use client";

import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { ProductListItem } from "@/entities/product/types";
import { getProductCardImage } from "@/entities/product";
import Link from "next/link";
import { ProductCard, ProductCardSkeleton } from "@/shared/ui/ProductCard";
import { getProducts } from "@/entities/product/api";
import styles from "./BestSellersSection.module.scss";

export function BestSellersSection() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getProducts(3, 1, controller.signal)
      .then((res) => setProducts(res.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const items = useMemo(() => {
    return products.slice(0, 3).map((p, idx) => ({
      key: p.slug || String(p.id),
      title: p.name,
      subtitle: p.description,
      price: p.base_price,
      image: getProductCardImage(p, idx),
      colors: p.colors || [],
      enabledColors: new Set(p.enabled_colors || []),
      href: p.slug ? `/products/${p.slug}` : "/products",
    }));
  }, [products]);

  const skeletonKeys = useMemo(() => ["skeleton-0", "skeleton-1", "skeleton-2"], []);

  return (
    <section className={styles.section} aria-label="Best Sellers">
      <div className={`${styles.inner} container`}>
        <header className={styles.header}>
          <h2 className={styles.title}>Best Sellers</h2>
          <Link className={styles.link} href="/products">
            View all
          </Link>
        </header>

        <div className={styles.desktopGrid} aria-busy={loading}>
          {loading
            ? skeletonKeys.map((k) => <ProductCardSkeleton key={k} />)
            : items.map((p) => (
                <ProductCard
                  key={p.key}
                  title={p.title}
                  subtitle={p.subtitle ?? undefined}
                  price={p.price}
                  image={p.image}
                  colors={p.colors}
                  enabledColors={p.enabledColors}
                  href={p.href}
                />
              ))}
        </div>

        <div className={styles.mobileSlider}>
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            spaceBetween={16}
            pagination={{ clickable: true }}
          >
            {(loading ? skeletonKeys : items.map((p) => p.key)).map((key, idx) => {
              const p = !loading ? items[idx] : null;
              return (
                <SwiperSlide key={key} className={styles.slide} aria-busy={loading}>
                  {loading ? (
                    <ProductCardSkeleton />
                  ) : (
                    <ProductCard
                      title={p!.title}
                      subtitle={p!.subtitle ?? undefined}
                      price={p!.price}
                      image={p!.image}
                      colors={p!.colors}
                      enabledColors={p!.enabledColors}
                      href={p!.href}
                    />
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
