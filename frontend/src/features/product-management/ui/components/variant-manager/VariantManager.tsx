"use client";

import { emptyVariantForm } from "../../../lib/forms";
import { VariantAttributeLibrary } from "./VariantAttributeLibrary";
import { NewVariantPanel } from "./NewVariantPanel";
import { VariantCard } from "./VariantCard";
import { VariantManagerProps } from "./types";
import styles from "../../ProductList.module.scss";

export const VariantManager = ({
  variants,
  basePrice,
  availableColors,
  availableSizes,
  newVariantForm,
  newColorValue,
  newSizeValue,
  variantDrafts,
  variantFiles,
  actionLoading,
  toAbsoluteImageUrl,
  onNewVariantField,
  onNewVariantColor,
  onVariantDraftField,
  onVariantDraftColor,
  onNewColorValue,
  onNewSizeValue,
  onCreateColor,
  onCreateSize,
  onAddVariant,
  onSaveVariant,
  onDeleteVariant,
  onVariantFiles,
  onUploadVariantImages,
  onDeleteVariantImage,
  onMoveVariantImage,
}: VariantManagerProps) => {
  return (
    <div className={styles.variantsBlock}>
      <div className={styles.variantsHeader}>
        <div>
          <h3 className={styles.variantsTitle}>Product Variants</h3>
          <p className={styles.variantsSubtitle}>
            Manage SKU, optional price override, stock, and photos for every
            variant.
          </p>
        </div>
        <span className={styles.variantCountChip}>
          {variants.length} variant{variants.length === 1 ? "" : "s"}
        </span>
      </div>

      <VariantAttributeLibrary
        availableColors={availableColors}
        availableSizes={availableSizes}
        newColorValue={newColorValue}
        newSizeValue={newSizeValue}
        actionLoading={actionLoading}
        onNewColorValue={onNewColorValue}
        onNewSizeValue={onNewSizeValue}
        onCreateColor={onCreateColor}
        onCreateSize={onCreateSize}
      />

      <NewVariantPanel
        basePrice={basePrice}
        availableColors={availableColors}
        availableSizes={availableSizes}
        newVariantForm={newVariantForm}
        actionLoading={actionLoading}
        onNewVariantField={onNewVariantField}
        onNewVariantColor={onNewVariantColor}
        onAddVariant={onAddVariant}
      />

      {variants.length === 0 && (
        <p className={styles.variantEmpty}>
          No variants available for this product.
        </p>
      )}

      {variants.length > 0 && (
        <div className={styles.variantCards}>
          {variants.map((variant) => (
            <VariantCard
              key={variant.id}
              variant={variant}
              basePrice={basePrice}
              availableColors={availableColors}
              availableSizes={availableSizes}
              draft={variantDrafts[variant.id] || emptyVariantForm}
              selectedFilesCount={variantFiles[variant.id]?.length || 0}
              actionLoading={actionLoading}
              toAbsoluteImageUrl={toAbsoluteImageUrl}
              onVariantDraftField={onVariantDraftField}
              onVariantDraftColor={onVariantDraftColor}
              onSaveVariant={onSaveVariant}
              onDeleteVariant={onDeleteVariant}
              onVariantFiles={onVariantFiles}
              onUploadVariantImages={onUploadVariantImages}
              onDeleteVariantImage={onDeleteVariantImage}
              onMoveVariantImage={onMoveVariantImage}
            />
          ))}
        </div>
      )}
    </div>
  );
};
