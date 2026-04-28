import { ChangeEvent } from "react";
import { ProductVariant, VariantImage } from "@/entities/product/types";
import { VariantFormState } from "../../types";

export type VariantFieldChangeHandler = (
  field: keyof VariantFormState,
) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

export type VariantDraftFieldChangeHandler = (
  variantId: number,
  field: keyof VariantFormState,
) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

export type VariantColorSelectHandler = (color: string) => void;

export type VariantDraftColorSelectHandler = (
  variantId: number,
  color: string,
) => void;

export type VariantFilesChangeHandler = (
  variantId: number,
  files: FileList | null,
) => void;

export type VariantImageUploadHandler = (
  variantId: number,
  existingImages: VariantImage[],
) => void | Promise<void>;

export type VariantImageDeleteHandler = (imageId: number) => void | Promise<void>;

export type VariantImageMoveHandler = (
  images: VariantImage[],
  imageId: number,
  direction: "earlier" | "later",
) => void | Promise<void>;

export type VariantManagerProps = {
  variants: ProductVariant[];
  basePrice: number;
  availableColors: string[];
  availableSizes: string[];
  newVariantForm: VariantFormState;
  newColorValue: string;
  newSizeValue: string;
  variantDrafts: Record<number, VariantFormState>;
  variantFiles: Record<number, File[]>;
  actionLoading: boolean;
  toAbsoluteImageUrl: (imageLink: string) => string;
  onNewVariantField: VariantFieldChangeHandler;
  onNewVariantColor: VariantColorSelectHandler;
  onVariantDraftField: VariantDraftFieldChangeHandler;
  onVariantDraftColor: VariantDraftColorSelectHandler;
  onNewColorValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onNewSizeValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onCreateColor: () => void | Promise<void>;
  onCreateSize: () => void | Promise<void>;
  onAddVariant: () => void | Promise<void>;
  onSaveVariant: (variantId: number) => void | Promise<void>;
  onDeleteVariant: (variantId: number) => void | Promise<void>;
  onVariantFiles: VariantFilesChangeHandler;
  onUploadVariantImages: VariantImageUploadHandler;
  onDeleteVariantImage: VariantImageDeleteHandler;
  onMoveVariantImage: VariantImageMoveHandler;
};

