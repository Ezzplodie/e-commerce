"use client";

import { AvailableColors } from "@/shared/ui/AvailableColors";
import { Button } from "@/shared/ui/Button";
import { SelectInput, TextInput } from "@/shared/ui/Input";
import { VariantFormState } from "../../../types";
import {
  VariantColorSelectHandler,
  VariantFieldChangeHandler,
} from "./types";
import styles from "../../ProductList.module.scss";

type NewVariantPanelProps = {
  basePrice: number;
  availableColors: string[];
  availableSizes: string[];
  newVariantForm: VariantFormState;
  actionLoading: boolean;
  onNewVariantField: VariantFieldChangeHandler;
  onNewVariantColor: VariantColorSelectHandler;
  onAddVariant: () => void | Promise<void>;
};

export const NewVariantPanel = ({
  basePrice,
  availableColors,
  availableSizes,
  newVariantForm,
  actionLoading,
  onNewVariantField,
  onNewVariantColor,
  onAddVariant,
}: NewVariantPanelProps) => {
  return (
    <div className={styles.newVariantPanel}>
      <div className={styles.newVariantHeading}>
        <p className={styles.newVariantTitle}>Add New Variant</p>
        <p className={styles.newVariantText}>
          Create another product option and then upload its photos.
        </p>
      </div>

      <div className={styles.newVariantForm}>
        <label className={styles.variantField}>
          <span className={styles.variantFieldLabel}>SKU</span>
          <TextInput
            value={newVariantForm.sku}
            onChange={onNewVariantField("sku")}
            placeholder="Variant SKU"
            className={styles.adminInput}
          />
        </label>
        <label className={styles.variantField}>
          <span className={styles.variantFieldLabel}>Price Override</span>
          <TextInput
            type="number"
            value={newVariantForm.price}
            onChange={onNewVariantField("price")}
            placeholder="Use product base price"
            className={styles.adminInput}
          />
        </label>
        <label className={styles.variantField}>
          <span className={styles.variantFieldLabel}>Stock</span>
          <TextInput
            type="number"
            value={newVariantForm.stock}
            onChange={onNewVariantField("stock")}
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
              selectedColor={newVariantForm.color}
              onSelectColor={onNewVariantColor}
              className={styles.colorPalette}
              buttonClassName={styles.colorPaletteButton}
            />
            <p className={styles.selectionHint}>
              {newVariantForm.color
                ? `Selected color: ${newVariantForm.color}`
                : "Choose a color for the new variant."}
            </p>
          </>
        ) : (
          <p className={styles.selectionHint}>
            Add a color option first, then assign it to the variant.
          </p>
        )}

        <label className={styles.variantField}>
          <span className={styles.variantFieldLabel}>Size</span>
          <SelectInput
            value={newVariantForm.size}
            onChange={onNewVariantField("size")}
            className={styles.selectInput}
            disabled={availableSizes.length === 0}
          >
            <option value="">
              {availableSizes.length > 0
                ? "Choose size"
                : "Add a size option first"}
            </option>
            {availableSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </SelectInput>
        </label>
        <p className={styles.selectionHint}>
          {newVariantForm.size
            ? `Selected size: ${newVariantForm.size}`
            : availableSizes.length > 0
              ? "Choose the size for this variant."
              : "Add a size option above to assign it here."}
        </p>
      </div>

      <div className={styles.variantActionsRow}>
        <Button
          type="button"
          className={`${styles.actionButton} ${styles.compactButton}`}
          disabled={actionLoading}
          onClick={onAddVariant}
        >
          Add Variant
        </Button>
      </div>
    </div>
  );
};
