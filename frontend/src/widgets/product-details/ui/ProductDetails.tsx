"use client";

import { Product } from "@/entities/product/types";
import { AvailableColors } from "@/shared/ui/AvailableColors";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import clsx from "clsx";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useProductDetails } from "../model/useProductDetails";
import styles from "./ProductDetails.module.scss";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

type Props = {
  product: Product;
};

export function ProductDetails({ product }: Props) {
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const {
    selectedSize,
    selectedColor,
    availableColors,
    availableColorsInStock,
    availableSizes,
    availableSizesForColor,
    selectedVariant,
    activeVariantForDisplay,
    setSelectedSize,
    handleChangeColor,
    isSelectedColorOutOfStock,
  } = useProductDetails(product);

  const galleryImages = useMemo(
    () =>
      [...(activeVariantForDisplay?.variant_images ?? [])].sort(
        (a, b) => a.image_order - b.image_order,
      ),
    [activeVariantForDisplay?.variant_images],
  );

  const safeThumbsSwiper =
    thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null;

  return (
    <div className={clsx(styles.details_wrapper, "container")}>
      <div className={styles.product_details}>
        <div className={styles.gallery_column}>
          {galleryImages.length > 0 && (
            <>
              <Swiper
                modules={[Navigation, Thumbs]}
                navigation
                spaceBetween={12}
                thumbs={{ swiper: safeThumbsSwiper }}
                className={styles.main_swiper}
              >
                {galleryImages.map((img, index) => (
                  <SwiperSlide key={img.id}>
                    <div className={styles.main_image_wrapper}>
                      <Image
                        src={img.image_link}
                        alt={`${product.name} - ${index + 1}`}
                        fill
                        className={styles.product_image}
                        priority={index === 0}
                        sizes="(max-width: 992px) 100vw, 55vw"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {galleryImages.length > 1 && (
                <Swiper
                  modules={[FreeMode, Thumbs]}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={12}
                  slidesPerView={5}
                  freeMode
                  watchSlidesProgress
                  className={styles.thumbs_swiper}
                >
                  {galleryImages.map((img, index) => (
                    <SwiperSlide key={`thumb-${img.id}`}>
                      <div className={styles.thumb_image_wrapper}>
                        <Image
                          src={img.image_link}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          fill
                          className={styles.product_image}
                          sizes="96px"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </>
          )}
        </div>

        <div className={styles.info_column}>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              {
                label: product.category_name,
                href: `/category/${product.category_slug}`,
              },
              { label: product.name },
            ]}
          ></Breadcrumbs>
          <h1>{product.name}</h1>

          <h2>Color</h2>
          <AvailableColors
            colors={availableColors}
            selectedColor={selectedColor}
            enabledColors={availableColorsInStock}
            onSelectColor={handleChangeColor}
          />

          <div className={styles.size_header}>
            <h2>Size</h2>
            <button type="button" className={styles.size_guide}>
              Size Guide
            </button>
          </div>

          {isSelectedColorOutOfStock ? (
            <div className={styles.out_of_stock}>Out of stock</div>
          ) : (
            <div className={styles.size_dropdown}>
              <button
                type="button"
                className={styles.size_trigger}
                onClick={() => setIsSizeDropdownOpen((prev) => !prev)}
                aria-expanded={isSizeDropdownOpen}
              >
                <span>{selectedSize || "Size"}</span>
                <span
                  className={clsx(
                    styles.size_arrow,
                    isSizeDropdownOpen && styles.size_arrow_open,
                  )}
                >
                  v
                </span>
              </button>

              {isSizeDropdownOpen && (
                <div className={styles.size_options}>
                  {availableSizes.map((size) => {
                    const isAvailable = availableSizesForColor.includes(size);

                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setIsSizeDropdownOpen(false);
                        }}
                        disabled={!isAvailable}
                        className={clsx(
                          styles.size_option,
                          selectedSize === size && styles.size_option_active,
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className={styles.price}>
            Price:{" "}
            {selectedVariant?.price ??
              activeVariantForDisplay?.price ??
              product.base_price}
          </div>

          {product.description && (
            <section className={styles.description}>
              <h2>Description</h2>
              <p className={styles.description_text}>{product.description}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
