"use client";

import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { Product } from "@/entities/product/types";
import Link from "next/link";
import { ProductCard, ProductCardSkeleton } from "@/shared/ui/ProductCard";
import {
  getProductBySlug,
  getProducts,
  toAbsoluteImageUrl,
} from "@/features/product-management/api/products.api";
import styles from "./BestSellersSection.module.scss";

const fallbackImages = [
  "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

function getProductCardImage(product: Product, fallbackIndex: number) {
  const firstWithImage = (product.variants || []).find(
    (v) => (v.variant_images || []).length > 0,
  );
  const firstImage = firstWithImage?.variant_images?.[0]?.image_link;
  return firstImage
    ? toAbsoluteImageUrl(firstImage)
    : fallbackImages[fallbackIndex] || fallbackImages[0];
}

function getProductColors(product: Product) {
  const colors = (product.variants || [])
    .map((v) => v.attributes?.color)
    .filter(Boolean) as string[];
  return Array.from(new Set(colors));
}

function getProductEnabledColors(product: Product) {
  const enabled = (product.variants || [])
    .filter((v) => (v.stock ?? 0) > 0)
    .map((v) => v.attributes?.color)
    .filter(Boolean) as string[];

  return new Set(enabled);
}

export function BestSellersSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    getProducts(3, 1, controller.signal)
      .then(async (res) => {
        const baseProducts = res.products || [];
        const slugs = baseProducts
          .map((p) => p.slug)
          .filter(Boolean) as string[];

        // The list endpoint returns summary products (often without variants/images).
        // Fetch details by slug to get variants + variant_images like on ProductDetails.
        const detailed = await Promise.all(
          slugs.map(async (slug) => {
            try {
              return await getProductBySlug(slug);
            } catch {
              return null;
            }
          }),
        );

        const detailedBySlug = new Map(
          detailed.filter(Boolean).map((p) => [p!.slug, p!]),
        );

        setProducts(baseProducts.map((p) => detailedBySlug.get(p.slug) ?? p));
      })
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
      colors: getProductColors(p),
      enabledColors: getProductEnabledColors(p),
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
