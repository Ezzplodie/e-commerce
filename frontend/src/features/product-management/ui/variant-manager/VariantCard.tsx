"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { ProductVariant } from "@/entities/product/types";
import { emptyVariantForm } from "../../lib/forms";
import { sortVariantImages } from "../../lib/variantImages";
import { VariantFormState } from "../../types";
import {
  VariantDraftColorSelectHandler,
  VariantDraftFieldChangeHandler,
  VariantFilesChangeHandler,
  VariantImageDeleteHandler,
  VariantImageMoveHandler,
  VariantImageUploadHandler,
} from "./types";
import { VariantEditorPanel } from "./VariantEditorPanel";
import { VariantMediaPanel } from "./VariantMediaPanel";
import styles from "../ProductList.module.scss";

type VariantCardProps = {
  variant: ProductVariant;
  basePrice: number;
  availableColors: string[];
  availableSizes: string[];
  draft?: VariantFormState;
  selectedFilesCount: number;
  uploadErrorMessage: string | null;
  isExpanded: boolean;
  onToggleExpand: (variantId: number) => void;
  actionLoading: boolean;
  toAbsoluteImageUrl: (imageLink: string) => string;
  onVariantDraftField: VariantDraftFieldChangeHandler;
  onVariantDraftColor: VariantDraftColorSelectHandler;
  onSaveVariant: (variantId: number) => void | Promise<void>;
  onDeleteVariant: (variantId: number) => void | Promise<void>;
  onVariantFiles: VariantFilesChangeHandler;
  onUploadVariantImages: VariantImageUploadHandler;
  onDeleteVariantImage: VariantImageDeleteHandler;
  onMoveVariantImage: VariantImageMoveHandler;
};

export const VariantCard = ({
  variant,
  basePrice,
  availableColors,
  availableSizes,
  draft = emptyVariantForm,
  selectedFilesCount,
  uploadErrorMessage,
  isExpanded,
  onToggleExpand,
  actionLoading,
  toAbsoluteImageUrl,
  onVariantDraftField,
  onVariantDraftColor,
  onSaveVariant,
  onDeleteVariant,
  onVariantFiles,
  onUploadVariantImages,
  onDeleteVariantImage,
  onMoveVariantImage,
}: VariantCardProps) => {
  const images = sortVariantImages(
    Array.isArray(variant.variant_images) ? variant.variant_images : [],
  );
  const attributes = Object.entries(variant.attributes || {});
  const variantLabel = draft.sku || variant.sku || `Variant ${variant.id}`;
  const detailsPanelId = useId();

  return (
    <article
      className={`${styles.variantCard} ${
        isExpanded ? "" : styles.variantCardCollapsed
      }`}
    >
      <div className={styles.variantCardHeader}>
        <div className={styles.variantCardHeaderMain}>
          <button
            type="button"
            className={styles.variantExpandToggle}
            onClick={() => onToggleExpand(variant.id)}
            aria-expanded={isExpanded}
            aria-controls={detailsPanelId}
            aria-label={
              isExpanded
                ? `Collapse details for ${variantLabel}`
                : `Expand details for ${variantLabel}`
            }
            disabled={actionLoading}
          >
            <ChevronDown
              className={`${styles.expandChevron} ${
                isExpanded ? styles.expandChevronOpen : ""
              }`}
              size={20}
              strokeWidth={2}
              aria-hidden
            />
          </button>
          <div className={styles.variantHeading}>
            <span className={styles.variantBadge}>Variant #{variant.id}</span>
            <p className={styles.variantSku}>{variantLabel}</p>
          </div>
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
            <span key={`${variant.id}-${key}`} className={styles.attributeChip}>
              {key}: {value}
            </span>
          ))}
        </div>
      )}

      {!isExpanded && selectedFilesCount > 0 ? (
        <p className={styles.variantCollapsedFilesHint}>
          {selectedFilesCount} file(s) selected — expand this variant to upload.
        </p>
      ) : null}

      {isExpanded ? (
        <div
          id={detailsPanelId}
          className={styles.variantBody}
          role="region"
          aria-label={`Editing ${variantLabel}`}
        >
          <div className={styles.variantEditorColumn}>
            <VariantEditorPanel
              variantId={variant.id}
              basePrice={basePrice}
              availableColors={availableColors}
              availableSizes={availableSizes}
              draft={draft}
              actionLoading={actionLoading}
              onVariantDraftField={onVariantDraftField}
              onVariantDraftColor={onVariantDraftColor}
              onSaveVariant={onSaveVariant}
            />
          </div>

          <VariantMediaPanel
            variantId={variant.id}
            variantLabel={variantLabel}
            images={images}
            selectedFilesCount={selectedFilesCount}
            uploadErrorMessage={uploadErrorMessage}
            actionLoading={actionLoading}
            toAbsoluteImageUrl={toAbsoluteImageUrl}
            onVariantFiles={onVariantFiles}
            onUploadVariantImages={onUploadVariantImages}
            onDeleteVariantImage={onDeleteVariantImage}
            onMoveVariantImage={onMoveVariantImage}
          />
        </div>
      ) : null}
    </article>
  );
};

