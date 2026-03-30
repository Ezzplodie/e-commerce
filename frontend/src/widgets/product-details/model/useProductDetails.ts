import { Product } from "@/entities/product/types";
import { normalizeColor } from "@/shared/lib/color";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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
  const router = useRouter();
  const pathname = usePathname();

  const colorFromUrl = searchParams.get("color");
  const firstSelectableVariant = inStockVariants[0] ?? product.variants[0];
  const normalizedColorFromUrl = normalizeColor(colorFromUrl);
  const variantFromUrl = product.variants.find(
    (v) => normalizeColor(v.attributes.color) === normalizedColorFromUrl,
  );

  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const selectedColor =
    variantFromUrl?.attributes.color ?? firstSelectableVariant.attributes.color;
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
          normalizeColor(v.attributes.color) ===
            normalizeColor(selectedColor) && v.attributes.size === selectedSize,
      ),
    [product.variants, selectedColor, selectedSize],
  );
  const activeVariantForDisplay = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant;
    }

    return (
      product.variants.find(
        (v) =>
          normalizeColor(v.attributes.color) ===
            normalizeColor(selectedColor) && v.stock > 0,
      ) ??
      product.variants.find(
        (v) =>
          normalizeColor(v.attributes.color) === normalizeColor(selectedColor),
      ) ??
      firstSelectableVariant
    );
  }, [
    firstSelectableVariant,
    product.variants,
    selectedColor,
    selectedVariant,
  ]);

  const isCompletelyOutOfStock = useMemo(
    () => product.variants.every((v) => v.stock === 0),
    [product.variants],
  );
  const isSelectedColorOutOfStock = useMemo(
    () =>
      !product.variants.some(
        (v) =>
          normalizeColor(v.attributes.color) ===
            normalizeColor(selectedColor) && v.stock > 0,
      ),
    [product.variants, selectedColor],
  );

  const handleChangeColor = (color: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (color) {
      params.set("color", normalizeColor(color));
      router.push(`${pathname}?${params.toString()}`);
    }
    setSelectedSize(null);
  };

  return {
    selectedSize,
    selectedColor,
    availableColors,
    availableColorsInStock,
    availableSizes,
    availableSizesForColor,
    selectedVariant,
    activeVariantForDisplay,
    isCompletelyOutOfStock,
    setSelectedSize,
    handleChangeColor,
    isSelectedColorOutOfStock,
    variantFromUrl,
  };
}
