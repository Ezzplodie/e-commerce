"use client";

import { AvailableColors } from "@/shared/ui/AvailableColors";
import { Button } from "@/shared/ui/Button";
import { SelectInput, TextInput } from "@/shared/ui/Input";
import { VariantFormState } from "../../types";
import {
  VariantDraftColorSelectHandler,
  VariantDraftFieldChangeHandler,
} from "./types";
import styles from "../ProductList.module.scss";

type VariantEditorPanelProps = {
  variantId: number;
  basePrice: number;
  availableColors: string[];
  availableSizes: string[];
  draft: VariantFormState;
  actionLoading: boolean;
  onVariantDraftField: VariantDraftFieldChangeHandler;
  onVariantDraftColor: VariantDraftColorSelectHandler;
  onSaveVariant: (variantId: number) => void | Promise<void>;
};

export const VariantEditorPanel = ({
  variantId,
  basePrice,
  availableColors,
  availableSizes,
  draft,
  actionLoading,
  onVariantDraftField,
  onVariantDraftColor,
  onSaveVariant,
}: VariantEditorPanelProps) => {
  return (
    <div className={styles.variantEditorPanel}>
      <div className={styles.variantFormGrid}>
        <label className={styles.variantField}>
          <span className={styles.variantFieldLabel}>SKU</span>
          <TextInput
            value={draft.sku}
            onChange={onVariantDraftField(variantId, "sku")}
            placeholder="SKU"
            className={styles.adminInput}
          />
        </label>
        <label className={styles.variantField}>
          <span className={styles.variantFieldLabel}>Price Override</span>
          <TextInput
            type="number"
            value={draft.price}
            onChange={onVariantDraftField(variantId, "price")}
            placeholder="Use product base price"
            className={styles.adminInput}
          />
        </label>
        <label className={styles.variantField}>
          <span className={styles.variantFieldLabel}>Stock</span>
          <TextInput
            type="number"
            value={draft.stock}
            onChange={onVariantDraftField(variantId, "stock")}
            placeholder="Stock"
            className={styles.adminInput}
          />
        </label>
      </div>

      <div className={styles.variantSelectionPanel}>
        <p className={styles.selectionHint}>
          Leave price empty to use the product base price: ${basePrice.toFixed(2)}
        </p>
        <span className={styles.variantFieldLabel}>Color</span>
        {availableColors.length > 0 ? (
          <>
            <AvailableColors
              colors={availableColors}
              selectedColor={draft.color}
              onSelectColor={(color) => onVariantDraftColor(variantId, color)}
              className={styles.colorPalette}
              buttonClassName={styles.colorPaletteButton}
            />
            <p className={styles.selectionHint}>
              {draft.color
                ? `Selected color: ${draft.color}`
                : "Choose the color for this variant."}
            </p>
          </>
        ) : (
          <p className={styles.selectionHint}>
            Add a color option above to assign it here.
          </p>
        )}

        <label className={styles.variantField}>
          <span className={styles.variantFieldLabel}>Size</span>
          <SelectInput
            value={draft.size}
            onChange={onVariantDraftField(variantId, "size")}
            className={styles.selectInput}
            disabled={availableSizes.length === 0}
          >
            <option value="">
              {availableSizes.length > 0 ? "Choose size" : "Add a size option first"}
            </option>
            {availableSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </SelectInput>
        </label>
        <p className={styles.selectionHint}>
          {draft.size
            ? `Selected size: ${draft.size}`
            : availableSizes.length > 0
              ? "Choose the size for this variant."
              : "Add a size option above to assign it here."}
        </p>
      </div>

      <div className={styles.variantActionsRow}>
        <Button
          type="button"
          className={`${styles.actionButton} ${styles.compactButton}`}
          onClick={() => onSaveVariant(variantId)}
          disabled={actionLoading}
        >
          Save Variant
        </Button>
      </div>
    </div>
  );
};

