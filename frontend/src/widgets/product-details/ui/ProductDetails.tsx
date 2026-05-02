"use client";

import clsx from "clsx";
import { StaticImageData } from "next/image";
import { Heart, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { Product, dedupeVariantImages } from "@/entities/product";
import { blousesImage, plusSizeImage } from "@/shared/assets/images";
import { normalizeColor } from "@/shared/lib/color";
import { formatPrice } from "@/shared/lib/formatters";
import { AvailableColors } from "@/shared/ui/AvailableColors";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { Button } from "@/shared/ui/Button";
import { CartFeedbackToast, useCartStore } from "@/features/cart";
import {
  FABRIC_AND_CARE,
  FITTING_COPY,
  MATERIAL_CHIPS,
  MATERIAL_COPY,
  PRODUCT_DETAIL_COPY,
  SHIPPING_COPY,
} from "../model/copy";
import { splitTextToParagraphs } from "../lib/productDetailText";
import { useProductDetails } from "../model/useProductDetails";
import { ProductAccordion } from "./components/ProductAccordion";
import { ProductGallery, type GalleryImage } from "./components/ProductGallery";
import { ProductChip } from "./components/ProductChip";
import { ProductRecommendationCard } from "./components/ProductRecommendationCard";
import styles from "./ProductDetails.module.scss";

type Props = {
  product: Product;
};

type RecommendationItem = {
  title: string;
  subtitle: string;
  price: number;
  image: string | StaticImageData;
  colors: string[];
};

export function ProductDetails({ product }: Props) {
  const {
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
  } = useProductDetails(product);
  const { addItem } = useCartStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSizeMenuOpen, setIsSizeMenuOpen] = useState(false);

  const allImages = useMemo(
    () =>
      dedupeVariantImages(
        product.variants.flatMap((variant) => variant.variant_images),
      ),
    [product.variants],
  );

  const colorVariants = useMemo(() => {
    const normalizedSelectedColor = normalizeColor(selectedColor);

    return product.variants.filter(
      (variant) =>
        normalizeColor(variant.attributes.color) === normalizedSelectedColor,
    );
  }, [product.variants, selectedColor]);

  const activeSize =
    selectedSize ||
    (!isSelectedColorOutOfStock
      ? activeVariantForDisplay?.attributes.size || null
      : null);

  const resolvedPrice =
    selectedVariant?.price ??
    activeVariantForDisplay?.price ??
    product.base_price;

  const galleryImages = useMemo<GalleryImage[]>(() => {
    const sourceImages = dedupeVariantImages(
      selectedVariant?.variant_images?.length
        ? selectedVariant.variant_images
        : colorVariants.length
          ? colorVariants.flatMap((variant) => variant.variant_images)
          : activeVariantForDisplay?.variant_images?.length
            ? activeVariantForDisplay.variant_images
            : allImages,
    );

    const fallbackImages: GalleryImage[] = sourceImages.map((image, index) => ({
      key: `${image.id}-${image.image_order}-${index}`,
      src: image.image_link,
      alt: `${product.name} view ${index + 1}`,
    }));

    if (!fallbackImages.length) {
      fallbackImages.push(
        {
          key: "placeholder-primary",
          src: plusSizeImage,
          alt: `${product.name} placeholder`,
        },
        {
          key: "placeholder-secondary",
          src: blousesImage,
          alt: `${product.name} placeholder alternate`,
        },
      );
    }

    return fallbackImages;
  }, [
    activeVariantForDisplay,
    allImages,
    colorVariants,
    product.name,
    selectedVariant,
  ]);

  const activeImageIndex =
    selectedImageIndex < galleryImages.length ? selectedImageIndex : 0;

  const recommendations = useMemo<RecommendationItem[]>(() => {
    const recommendationImages = [
      plusSizeImage,
      galleryImages[0]?.src ?? plusSizeImage,
      blousesImage,
    ];

    return [
      {
        title: "Shirt Dress",
        subtitle: "Turn It Up Dress",
        price: 245,
        image: recommendationImages[0],
        colors: ["#0c0c0c", "#7dc3eb", "#748c70"],
      },
      {
        title: "Chill Wrap Top",
        subtitle: "Turn It Up Top",
        price: 199,
        image: recommendationImages[1],
        colors: ["#909225", "#ffffff"],
      },
      {
        title: "Rule Zip Jacket",
        subtitle: "Turn It Up Jacket",
        price: 199,
        image: recommendationImages[2],
        colors: ["#909225", "#c88232"],
      },
    ];
  }, [galleryImages]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    {
      label: product.category_name ?? "Top + Blouses",
      href: product.category_slug
        ? `/category/${product.category_slug}`
        : undefined,
    },
    { label: product.name || "Wrap Top" },
  ];

  const heroTitle = product.name || "Wrap Top";
  const heroDescription =
    product.description?.trim() ||
    "Versatile and universally flattering, our wrap blouse can be tied, draped, snapped and wrapped multiple ways.";

  const fittingParagraphs = useMemo(() => {
    const fromApi = product.fitting?.trim();
    if (fromApi) {
      return splitTextToParagraphs(fromApi);
    }
    return [FITTING_COPY];
  }, [product.fitting]);

  const fabricParagraphs = useMemo(() => {
    const fromApi = product.fabric_care?.trim();
    if (fromApi) {
      return splitTextToParagraphs(fromApi);
    }
    return [...FABRIC_AND_CARE];
  }, [product.fabric_care]);

  const productDetailParagraphs = useMemo(() => {
    const fromApi = product.product_detail?.trim();
    if (fromApi) {
      return splitTextToParagraphs(fromApi);
    }
    return [PRODUCT_DETAIL_COPY];
  }, [product.product_detail]);

  const materialEyebrow =
    product.material?.name?.trim() || "Silk";
  const materialDescription =
    product.material?.description?.trim() || MATERIAL_COPY;
  const showPlaceholderMaterialChips = !product.material;

  return (
    <>
      <section className={styles.pageSection}>
        <div className={styles.inner}>
          <Breadcrumbs className={styles.breadcrumbs} items={breadcrumbItems} />

          <div className={styles.heroGrid}>
            <ProductGallery
              images={galleryImages}
              productName={heroTitle}
              activeIndex={activeImageIndex}
              onSelectImage={setSelectedImageIndex}
            />

            <div className={styles.summary}>
              <div className={styles.summaryBlock}>
                <h1 className={styles.title}>{heroTitle}</h1>
                <p className={styles.description}>{heroDescription}</p>
              </div>

              <div className={styles.optionGroup}>
                <span className={styles.optionLabel}>Colors</span>
                <AvailableColors
                  colors={
                    availableColors.length ? availableColors : ["Red", "White"]
                  }
                  selectedColor={selectedColor}
                  enabledColors={availableColorsInStock}
                  onSelectColor={(color) => {
                    handleChangeColor(color);
                    setSelectedImageIndex(0);
                    setIsSizeMenuOpen(false);
                  }}
                  variant="productDetails"
                />
              </div>

              <div className={styles.optionGroup}>
                <div className={styles.optionHeader}>
                  <span className={styles.optionLabel}>Size</span>
                  <button type="button" className={styles.sizeGuide}>
                    Size Guide
                  </button>
                </div>

                <div className={styles.sizeField}>
                  <button
                    type="button"
                    className={clsx(
                      styles.sizeTrigger,
                      isSizeMenuOpen && styles.sizeTriggerOpen,
                    )}
                    onClick={() => setIsSizeMenuOpen((current) => !current)}
                    aria-expanded={isSizeMenuOpen}
                  >
                    <span>{activeSize || "Select size"}</span>
                    <span className={styles.sizeChevron} aria-hidden="true">
                      {isSizeMenuOpen ? "-" : "+"}
                    </span>
                  </button>

                  {isSizeMenuOpen ? (
                    <div className={styles.sizeMenu}>
                      {availableSizes.map((size) => {
                        const isAvailable =
                          availableSizesForColor.includes(size);

                        return (
                          <button
                            key={size}
                            type="button"
                            className={clsx(
                              styles.sizeOption,
                              activeSize === size && styles.sizeOptionActive,
                            )}
                            onClick={() => {
                              setSelectedSize(size);
                              setSelectedImageIndex(0);
                              setIsSizeMenuOpen(false);
                            }}
                            disabled={!isAvailable}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                {isSelectedColorOutOfStock ? (
                  <p className={styles.stockState}>
                    Out of stock in this color
                  </p>
                ) : null}
              </div>

              <Button
                className={styles.primaryAction}
                disabled={isCompletelyOutOfStock}
                onClick={() => {
                  addItem({
                    id:
                      selectedVariant?.id ||
                      activeVariantForDisplay?.id ||
                      product.id,
                    title: product.name || "Product",
                    size: activeSize || "N/A",
                    color: selectedColor || "N/A",
                    quantity: 1,
                    image:
                      galleryImages[activeImageIndex]?.src ??
                      galleryImages[0]?.src ??
                      plusSizeImage,
                    price: resolvedPrice,
                  });
                }}
              >
                {isCompletelyOutOfStock
                  ? "Out Of Stock"
                  : ` Add To Cart ${formatPrice(resolvedPrice)}`}
              </Button>

              <div className={styles.metaRow}>
                <button type="button" className={styles.metaAction}>
                  <Truck size={16} strokeWidth={1.7} />
                  <span>Easy Return</span>
                </button>

                <button type="button" className={styles.metaAction}>
                  <Heart size={16} strokeWidth={1.7} />
                  <span>Add To Wish List</span>
                </button>
              </div>

              <div className={styles.mobilePrice}>
                <span>Selected Price</span>
                <strong>{formatPrice(resolvedPrice)}</strong>
              </div>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.accordionStack}>
              <ProductAccordion title="Fitting">
                <div className={styles.richText}>
                  {fittingParagraphs.map((line, index) => (
                    <p key={`fitting-${index}`}>{line}</p>
                  ))}
                </div>
              </ProductAccordion>

              <ProductAccordion title="Fabric & Care" defaultOpen accent>
                <div className={styles.richText}>
                  {fabricParagraphs.map((line, index) => (
                    <p key={`fabric-${index}`}>{line}</p>
                  ))}
                </div>
              </ProductAccordion>

              <ProductAccordion title="Product Detail">
                <div className={styles.richText}>
                  {productDetailParagraphs.map((line, index) => (
                    <p key={`detail-${index}`}>{line}</p>
                  ))}
                </div>
              </ProductAccordion>

              <ProductAccordion title="Shipping And Return" defaultOpen accent>
                <div className={styles.richText}>
                  {SHIPPING_COPY.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </ProductAccordion>
            </div>

            <aside className={styles.materialCard}>
              <div className={styles.materialHeader}>
                <span className={styles.materialEyebrow}>{materialEyebrow}</span>
                <strong className={styles.materialPrice}>
                  {formatPrice(resolvedPrice)}
                </strong>
              </div>

              <p className={styles.materialDescription}>{materialDescription}</p>

              {showPlaceholderMaterialChips ? (
                <div className={styles.chipRow}>
                  {MATERIAL_CHIPS.map((chip) => (
                    <ProductChip key={chip} label={chip} />
                  ))}
                </div>
              ) : null}
            </aside>
          </div>

          <section
            className={styles.recommendationsSection}
            aria-labelledby="recommendations-heading"
          >
            <h2
              id="recommendations-heading"
              className={styles.recommendationsTitle}
            >
              You May Also Like
            </h2>

            <div className={styles.recommendationsGrid}>
              {recommendations.map((item) => (
                <ProductRecommendationCard
                  key={item.title}
                  title={item.title}
                  subtitle={item.subtitle}
                  price={item.price}
                  image={item.image}
                  colors={item.colors}
                />
              ))}
            </div>
          </section>
        </div>
      </section>
      <CartFeedbackToast />
    </>
  );
}
