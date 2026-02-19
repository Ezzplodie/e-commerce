"use client";

import { Product } from "@/entities/product/types";
import { AvailableColors } from "@/shared/ui/AvailableColors";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import clsx from "clsx";
import { useState } from "react";
import { useProductDetails } from "../model/useProductDetails";
import styles from "./ProductDetails.module.scss";

type Props = {
  product: Product;
};

export function ProductDetails({ product }: Props) {
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);

  const {
    selectedSize,
    selectedColor,
    availableColors,
    availableColorsInStock,
    availableSizes,
    availableSizesForColor,
    selectedVariant,
    isCompletelyOutOfStock,
    setSelectedSize,
    handleChangeColor,
  } = useProductDetails(product);
  return (
    <div className={clsx(styles.details_wrapper, "container")}>
      <div className={styles.product_details}>
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

        {isCompletelyOutOfStock ? (
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
          Price: {selectedVariant?.price ?? product.base_price}
        </div>
      </div>
    </div>
  );
}
