"use client";

import Image from "next/image";
import { VariantImage } from "@/entities/product/types";
import { Button } from "@/shared/ui/Button";
import {
  VariantFilesChangeHandler,
  VariantImageDeleteHandler,
  VariantImageMoveHandler,
  VariantImageUploadHandler,
} from "./types";
import styles from "../ProductList.module.scss";

type VariantMediaPanelProps = {
  variantId: number;
  variantLabel: string;
  images: VariantImage[];
  selectedFilesCount: number;
  actionLoading: boolean;
  toAbsoluteImageUrl: (imageLink: string) => string;
  onVariantFiles: VariantFilesChangeHandler;
  onUploadVariantImages: VariantImageUploadHandler;
  onDeleteVariantImage: VariantImageDeleteHandler;
  onMoveVariantImage: VariantImageMoveHandler;
};

export const VariantMediaPanel = ({
  variantId,
  variantLabel,
  images,
  selectedFilesCount,
  actionLoading,
  toAbsoluteImageUrl,
  onVariantFiles,
  onUploadVariantImages,
  onDeleteVariantImage,
  onMoveVariantImage,
}: VariantMediaPanelProps) => {
  return (
    <div className={styles.variantMediaColumn}>
      <div className={styles.variantMediaHeader}>
        <p className={styles.variantSectionTitle}>Photos</p>
        <p className={styles.variantMetaHint}>
          Use Earlier/Later to control gallery order.
        </p>
        <span className={styles.variantMeta}>{images.length} uploaded</span>
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
                        onMoveVariantImage(images, image.id, "earlier")
                      }
                      disabled={actionLoading || imageIndex === 0}
                    >
                      Earlier
                    </Button>
                    <Button
                      type="button"
                      className={styles.orderButton}
                      onClick={() => onMoveVariantImage(images, image.id, "later")}
                      disabled={actionLoading || imageIndex === images.length - 1}
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
            onChange={(event) => onVariantFiles(variantId, event.target.files)}
          />
          <span className={styles.filePickerButton}>Choose Photos</span>
          <span className={styles.filePickerText}>
            {selectedFilesCount > 0
              ? `${selectedFilesCount} file(s) selected`
              : "No files selected"}
          </span>
        </label>

        <Button
          type="button"
          className={`${styles.actionButton} ${styles.compactButton}`}
          onClick={() => onUploadVariantImages(variantId, images)}
          disabled={actionLoading || selectedFilesCount === 0}
        >
          Upload Photos
        </Button>
      </div>
    </div>
  );
};

