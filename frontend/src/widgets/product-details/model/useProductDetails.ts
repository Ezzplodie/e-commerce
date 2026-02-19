import { Product } from "@/entities/product/types";
import { normalizeColor } from "@/shared/lib/color";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

const getSizeSortRank = (size: string) => {
  const rank = SIZE_ORDER.indexOf(size);
  return rank === -1 ? Number.POSITIVE_INFINITY : rank;
};

const compareSizes = (a: string, b: string) => {
  const rankDiff = getSizeSortRank(a) - getSizeSortRank(b);
  if (rankDiff !== 0) return rankDiff;
  return a.localeCompare(b);
};

export function useProductDetails(product: Product) {
  const inStockVariants = useMemo(
    () => product.variants.filter((variant) => variant.stock > 0),
    [product.variants],
  );
  const searchParams = useSearchParams();
  const colorFromUrl = searchParams.get("color");
  const firstSelectableVariant = inStockVariants[0] ?? product.variants[0];
  const normalizedColorFromUrl = normalizeColor(colorFromUrl);
  const variantFromUrl = product.variants.find(
    (v) => normalizeColor(v.attributes.color) === normalizedColorFromUrl,
  );
  const initialColor =
    variantFromUrl?.attributes.color ?? firstSelectableVariant.attributes.color;
  const initalVariantForColor =
    product.variants.find(
      (v) =>
        normalizeColor(v.attributes.color) === normalizeColor(initialColor),
    ) ??
    firstSelectableVariant;
  const [selectedSize, setSelectedSize] = useState(
    initalVariantForColor.attributes.size,
  );

  const [selectedColor, setSelectedColor] = useState(initialColor);

  const availableColors = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.attributes.color))),
    [product.variants],
  );

  const availableColorsInStock = useMemo(
    () => new Set(inStockVariants.map((v) => v.attributes.color)),
    [inStockVariants],
  );

  const availableSizes = useMemo(
    () =>
      Array.from(new Set(product.variants.map((v) => v.attributes.size))).sort(
        compareSizes,
      ),
    [product.variants],
  );

  const availableSizesForColor = useMemo(
    () =>
      Array.from(
        new Set(
          product.variants
            .filter(
              (v) =>
                normalizeColor(v.attributes.color) ===
                  normalizeColor(selectedColor) && v.stock > 0,
            )
            .map((v) => v.attributes.size),
        ),
      ).sort(compareSizes),
    [product.variants, selectedColor],
  );

  const selectedVariant = useMemo(
    () =>
      product.variants.find(
        (v) =>
          normalizeColor(v.attributes.color) === normalizeColor(selectedColor) &&
          v.attributes.size === selectedSize,
      ),
    [product.variants, selectedColor, selectedSize],
  );

  const isCompletelyOutOfStock = useMemo(
    () => product.variants.every((v) => v.stock === 0),
    [product.variants],
  );

  const handleChangeColor = useCallback(
    (color: string) => {
      const variantsForColor = product.variants.filter(
        (v) =>
          normalizeColor(v.attributes.color) === normalizeColor(color) &&
          v.stock > 0,
      );
      if (variantsForColor.length === 0) return;

      const sizesForColor = variantsForColor.map((v) => v.attributes.size);
      if (!sizesForColor.includes(selectedSize)) {
        setSelectedSize(sizesForColor[0]);
      }
      setSelectedColor(variantsForColor[0].attributes.color);
    },
    [product.variants, selectedSize],
  );

  return {
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
  };
}
