"use client";

import { ChangeEvent } from "react";
import { AvailableColors } from "@/shared/ui/AvailableColors";
import { Button } from "@/shared/ui/Button";
import { TextInput } from "@/shared/ui/Input";
import styles from "../../ProductList.module.scss";

type VariantAttributeLibraryProps = {
  availableColors: string[];
  availableSizes: string[];
  newColorValue: string;
  newSizeValue: string;
  actionLoading: boolean;
  onNewColorValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onNewSizeValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onCreateColor: () => void | Promise<void>;
  onCreateSize: () => void | Promise<void>;
};

export const VariantAttributeLibrary = ({
  availableColors,
  availableSizes,
  newColorValue,
  newSizeValue,
  actionLoading,
  onNewColorValue,
  onNewSizeValue,
  onCreateColor,
  onCreateSize,
}: VariantAttributeLibraryProps) => {
  return (
    <div className={styles.attributeLibraryPanel}>
      <div className={styles.attributeLibraryHeader}>
        <div>
          <p className={styles.variantSectionTitle}>Attribute Options</p>
          <p className={styles.variantMetaHint}>
            Create reusable color and size values, then assign them to variants
            below.
          </p>
        </div>
      </div>

      <div className={styles.attributeLibrarySection}>
        <div className={styles.attributeLibraryHeader}>
          <div>
            <p className={styles.variantSectionTitle}>Color Options</p>
            <p className={styles.variantMetaHint}>
              Pick a shared color for each variant or add a new one once for
              the whole product.
            </p>
          </div>
        </div>

        {availableColors.length > 0 ? (
          <AvailableColors
            colors={availableColors}
            className={styles.colorPalette}
            buttonClassName={styles.colorPaletteButton}
          />
        ) : (
          <div className={styles.attributeEmptyState}>
            No colors available yet. Add the first color below.
          </div>
        )}

        <div className={styles.attributeCreateRow}>
          <label className={styles.variantField}>
            <span className={styles.variantFieldLabel}>New Color</span>
            <TextInput
              value={newColorValue}
              onChange={onNewColorValue}
              placeholder="Add a color, e.g. Olive"
              className={styles.adminInput}
            />
          </label>
          <Button
            type="button"
            className={`${styles.actionButton} ${styles.compactButton}`}
            disabled={actionLoading || !newColorValue.trim()}
            onClick={onCreateColor}
          >
            Add Color
          </Button>
        </div>
      </div>

      <div className={styles.attributeLibrarySection}>
        <div className={styles.attributeLibraryHeader}>
          <div>
            <p className={styles.variantSectionTitle}>Size Options</p>
            <p className={styles.variantMetaHint}>
              Create reusable sizes once, then choose them for each variant.
            </p>
          </div>
        </div>

        {availableSizes.length > 0 ? (
          <div className={styles.attributeList}>
            {availableSizes.map((size) => (
              <span key={size} className={styles.attributeChip}>
                {size}
              </span>
            ))}
          </div>
        ) : (
          <div className={styles.attributeEmptyState}>
            No sizes available yet. Add the first size below.
          </div>
        )}

        <div className={styles.attributeCreateRow}>
          <label className={styles.variantField}>
            <span className={styles.variantFieldLabel}>New Size</span>
            <TextInput
              value={newSizeValue}
              onChange={onNewSizeValue}
              placeholder="Add a size, e.g. M"
              className={styles.adminInput}
            />
          </label>
          <Button
            type="button"
            className={`${styles.actionButton} ${styles.compactButton}`}
            disabled={actionLoading || !newSizeValue.trim()}
            onClick={onCreateSize}
          >
            Add Size
          </Button>
        </div>
      </div>
    </div>
  );
};
