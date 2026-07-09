"use client";

import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { ProductListItem } from "@/entities/product/types";
import { getProductCardImage } from "@/entities/product";
import Link from "next/link";
import { Container } from "@/shared/ui/Container";
import { AddToWishListButton } from "@/features/wish-list";
import { ProductCard, ProductCardSkeleton } from "@/shared/ui/ProductCard";
import styles from "./BestSellersSection.module.scss";

interface Props {
  products: ProductListItem[];
}

export function BestSellersSection({ products }: Props) {
  const items = useMemo(() => {
    return products.slice(0, 8).map((p, idx) => ({
      key: p.slug || String(p.id),
      variantId: p.default_variant_id ?? undefined,
      title: p.name,
      subtitle: p.description ?? undefined,
      price: p.base_price,
      image: getProductCardImage(p, idx),
      colors: p.colors || [],
      enabledColors: new Set(p.enabled_colors || []),
      href: p.slug ? `/products/${p.slug}` : "/products",
    }));
  }, [products]);

  const isEmpty = items.length === 0;
  const skeletonKeys = useMemo(
    () => ["skeleton-0", "skeleton-1", "skeleton-2", "skeleton-3"],
    [],
  );

  const slides = isEmpty
    ? skeletonKeys.map((key) => ({ key, item: null }))
    : items.map((item) => ({ key: item.key, item }));

  return (
    <section className={styles.section} aria-label="Best Sellers">
      <Container>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Customer favourites</p>
            <h2 className={styles.title}>Best Sellers</h2>
          </div>
          <Link className={styles.link} href="/products">
            View all
          </Link>
        </header>

        <div className={styles.slider} aria-busy={isEmpty}>
          <Swiper
            modules={[Pagination]}
            slidesPerView={2}
            spaceBetween={16}
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 3, spaceBetween: 16 },
              1280: { slidesPerView: 4, spaceBetween: 20 },
            }}
          >
            {slides.map(({ key, item }) => (
              <SwiperSlide key={key} className={styles.slide}>
                {item ? (
                  <ProductCard
                    title={item.title}
                    subtitle={item.subtitle}
                    price={item.price}
                    image={item.image}
                    colors={item.colors}
                    enabledColors={item.enabledColors}
                    href={item.href}
                    imageAction={
                      item.variantId ? (
                        <AddToWishListButton
                          title={item.title}
                          variantId={item.variantId}
                        />
                      ) : undefined
                    }
                  />
                ) : (
                  <ProductCardSkeleton />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </section>
  );
}
