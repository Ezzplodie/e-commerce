"use client";

import { ChangeEvent } from "react";
import Image from "next/image";
import { ProductVariant, VariantImage } from "@/entities/product/types";
import { AvailableColors } from "@/shared/ui/AvailableColors";
import { Button } from "@/shared/ui/Button";
import { TextInput } from "@/shared/ui/Input";
import { VariantFormState } from "../../types";
import styles from "../ProductList.module.scss";

const sortVariantImages = (images: VariantImage[]) =>
  [...images].sort((left, right) => {
    const leftOrder = Number.isFinite(left.image_order) ? left.image_order : 0;
    const rightOrder = Number.isFinite(right.image_order)
      ? right.image_order
      : 0;

    if (leftOrder === rightOrder) {
      return left.id - right.id;
    }

    return leftOrder - rightOrder;
  });

type VariantManagerProps = {
  variants: ProductVariant[];
  basePrice: number;
  availableColors: string[];
  newVariantForm: VariantFormState;
  newColorValue: string;
  variantDrafts: Record<number, VariantFormState>;
  variantFiles: Record<number, File[]>;
  actionLoading: boolean;
  toAbsoluteImageUrl: (imageLink: string) => string;
  onNewVariantField: (
    field: keyof VariantFormState,
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  onNewVariantColor: (color: string) => void;
  onVariantDraftField: (
    variantId: number,
    field: keyof VariantFormState,
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  onVariantDraftColor: (variantId: number, color: string) => void;
  onNewColorValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onCreateColor: () => void | Promise<void>;
  onAddVariant: () => void | Promise<void>;
  onSaveVariant: (variantId: number) => void | Promise<void>;
  onDeleteVariant: (variantId: number) => void | Promise<void>;
  onVariantFiles: (variantId: number, files: FileList | null) => void;
  onUploadVariantImages: (
    variantId: number,
    existingImages: VariantImage[],
  ) => void | Promise<void>;
  onDeleteVariantImage: (imageId: number) => void | Promise<void>;
  onMoveVariantImage: (
    images: VariantImage[],
    imageId: number,
    direction: "earlier" | "later",
  ) => void | Promise<void>;
};

export const VariantManager = ({
  variants,
  basePrice,
  availableColors,
  newVariantForm,
  newColorValue,
  variantDrafts,
  variantFiles,
  actionLoading,
  toAbsoluteImageUrl,
  onNewVariantField,
  onNewVariantColor,
  onVariantDraftField,
  onVariantDraftColor,
  onNewColorValue,
  onCreateColor,
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

      <div className={styles.attributeLibraryPanel}>
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

        <div className={styles.colorCreateRow}>
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

      {variants.length === 0 && (
        <p className={styles.variantEmpty}>
          No variants available for this product.
        </p>
      )}

      {variants.length > 0 && (
        <div className={styles.variantCards}>
          {variants.map((variant) => {
            const images = sortVariantImages(
              Array.isArray(variant.variant_images)
                ? variant.variant_images
                : [],
            );
            const attributes = Object.entries(variant.attributes || {});
            const draft = variantDrafts[variant.id] || {
              sku: "",
              price: "",
              stock: "0",
              color: "",
            };
            const selectedFilesCount = variantFiles[variant.id]?.length || 0;
            const variantLabel =
              draft.sku || variant.sku || `Variant ${variant.id}`;

            return (
              <article key={variant.id} className={styles.variantCard}>
                <div className={styles.variantCardHeader}>
                  <div className={styles.variantHeading}>
                    <span className={styles.variantBadge}>
                      Variant #{variant.id}
                    </span>
                    <p className={styles.variantSku}>{variantLabel}</p>
                  </div>

                  <div className={styles.variantHeaderActions}>
                    <span className={styles.photoCountChip}>
                      {images.length} photo{images.length === 1 ? "" : "s"}
                    </span>
                    <Button
                      type="button"
                      className={`${styles.deleteButton} ${styles.variantDeleteButton}`}
                      onClick={() => onDeleteVariant(variant.id)}
                      disabled={actionLoading}
                    >
                      Delete Variant
                    </Button>
                  </div>
                </div>

                {attributes.length > 0 && (
                  <div className={styles.attributeList}>
                    {attributes.map(([key, value]) => (
                      <span
                        key={`${variant.id}-${key}`}
                        className={styles.attributeChip}
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}

                <div className={styles.variantBody}>
                  <div className={styles.variantEditorColumn}>
                    <div className={styles.variantEditorPanel}>
                      <div className={styles.variantFormGrid}>
                        <label className={styles.variantField}>
                          <span className={styles.variantFieldLabel}>SKU</span>
                          <TextInput
                            value={draft.sku}
                            onChange={onVariantDraftField(variant.id, "sku")}
                            placeholder="SKU"
                            className={styles.adminInput}
                          />
                        </label>
                        <label className={styles.variantField}>
                          <span className={styles.variantFieldLabel}>
                            Price Override
                          </span>
                          <TextInput
                            type="number"
                            value={draft.price}
                            onChange={onVariantDraftField(variant.id, "price")}
                            placeholder="Use product base price"
                            className={styles.adminInput}
                          />
                        </label>
                        <label className={styles.variantField}>
                          <span className={styles.variantFieldLabel}>
                            Stock
                          </span>
                          <TextInput
                            type="number"
                            value={draft.stock}
                            onChange={onVariantDraftField(variant.id, "stock")}
                            placeholder="Stock"
                            className={styles.adminInput}
                          />
                        </label>
                      </div>

                      <div className={styles.variantSelectionPanel}>
                        <p className={styles.selectionHint}>
                          Leave price empty to use the product base price: $
                          {basePrice.toFixed(2)}
                        </p>
                        <span className={styles.variantFieldLabel}>Color</span>
                        {availableColors.length > 0 ? (
                          <>
                            <AvailableColors
                              colors={availableColors}
                              selectedColor={draft.color}
                              onSelectColor={(color) =>
                                onVariantDraftColor(variant.id, color)
                              }
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
                      </div>

                      <div className={styles.variantActionsRow}>
                        <Button
                          type="button"
                          className={`${styles.actionButton} ${styles.compactButton}`}
                          onClick={() => onSaveVariant(variant.id)}
                          disabled={actionLoading}
                        >
                          Save Variant
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.variantMediaColumn}>
                    <div className={styles.variantMediaHeader}>
                      <p className={styles.variantSectionTitle}>Photos</p>
                      <p className={styles.variantMetaHint}>
                        Use Earlier/Later to control gallery order.
                      </p>
                      <span className={styles.variantMeta}>
                        {images.length} uploaded
                      </span>
                    </div>

                    {images.length > 0 ? (
                      <div className={styles.imageList}>
                        {images.map((image, imageIndex) => (
                          <div key={image.id} className={styles.imageCard}>
                            <div className={styles.imageFrame}>
                              <Image
                                src={toAbsoluteImageUrl(image.image_link)}
                                alt={`${variantLabel} photo ${imageIndex + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 320px"
                                className={styles.variantImage}
                              />
                            </div>
                            <div className={styles.imageCardFooter}>
                              <div className={styles.imageCardTopRow}>
                                <span className={styles.photoOrderChip}>
                                  Position {imageIndex + 1}
                                </span>
                                <div className={styles.imageOrderActions}>
                                  <Button
                                    type="button"
                                    className={styles.orderButton}
                                    onClick={() =>
                                      onMoveVariantImage(
                                        images,
                                        image.id,
                                        "earlier",
                                      )
                                    }
                                    disabled={actionLoading || imageIndex === 0}
                                  >
                                    Earlier
                                  </Button>
                                  <Button
                                    type="button"
                                    className={styles.orderButton}
                                    onClick={() =>
                                      onMoveVariantImage(
                                        images,
                                        image.id,
                                        "later",
                                      )
                                    }
                                    disabled={
                                      actionLoading ||
                                      imageIndex === images.length - 1
                                    }
                                  >
                                    Later
                                  </Button>
                                </div>
                              </div>
                              <Button
                                type="button"
                                className={`${styles.deleteButton} ${styles.photoDeleteButton}`}
                                onClick={() => onDeleteVariantImage(image.id)}
                                disabled={actionLoading}
                              >
                                Delete Photo
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.photoEmptyState}>
                        No photos uploaded for this variant yet.
                      </div>
                    )}

                    <div className={styles.uploadPanel}>
                      <label className={styles.filePicker}>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className={styles.fileInput}
                          onChange={(event) =>
                            onVariantFiles(variant.id, event.target.files)
                          }
                        />
                        <span className={styles.filePickerButton}>
                          Choose Photos
                        </span>
                        <span className={styles.filePickerText}>
                          {selectedFilesCount > 0
                            ? `${selectedFilesCount} file(s) selected`
                            : "No files selected"}
                        </span>
                      </label>

                      <Button
                        type="button"
                        className={`${styles.actionButton} ${styles.compactButton}`}
                        onClick={() =>
                          onUploadVariantImages(variant.id, images)
                        }
                        disabled={
                          actionLoading ||
                          !(variantFiles[variant.id]?.length > 0)
                        }
                      >
                        Upload Photos
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
