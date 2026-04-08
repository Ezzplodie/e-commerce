"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { ProductVariant, VariantImage } from "@/entities/product/types";
import {
  createVariantDrafts,
  emptyProductForm,
  emptyVariantForm,
} from "../lib/forms";
import {
  getAttributeOptions,
  getVariantAttributeValueIds,
  parseVariantPrice,
} from "../lib/variantAttributes";
import { getNextVariantImageOrder, moveItem } from "../lib/variantImages";
import { ProductFormState, VariantFormState } from "../types";
import { useAdminProducts } from "./useAdminProducts";

type ConfirmState = {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void | Promise<void>;
};

export const useProductList = () => {
  const {
    products,
    loading,
    error,
    page,
    limit,
    total,
    attributeValues,
    actionLoading,
    fetchProducts,
    setPage,
    setLimit,
    fetchProductBySlug,
    addAttributeOption,
    addProduct,
    editProduct,
    removeProduct,
    addVariant,
    editVariant,
    removeVariant,
    addVariantImage,
    removeVariantImage,
    reorderVariantImages,
    toAbsoluteImageUrl,
  } = useAdminProducts();

  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);

  const [createForm, setCreateForm] =
    useState<ProductFormState>(emptyProductForm);
  const [editForm, setEditForm] = useState<ProductFormState>(emptyProductForm);
  const [newVariantForm, setNewVariantForm] =
    useState<VariantFormState>(emptyVariantForm);
  const [newColorValue, setNewColorValue] = useState("");
  const [newSizeValue, setNewSizeValue] = useState("");

  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(
    null,
  );
  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [selectedVariants, setSelectedVariants] = useState<ProductVariant[]>(
    [],
  );
  const [variantDrafts, setVariantDrafts] = useState<
    Record<number, VariantFormState>
  >({});
  const [variantFiles, setVariantFiles] = useState<Record<number, File[]>>({});
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const firstItemNumber = products.length ? (page - 1) * limit + 1 : 0;
  const lastItemNumber = products.length
    ? Math.min((page - 1) * limit + products.length, total)
    : 0;

  const colorOptions = useMemo(
    () => getAttributeOptions(attributeValues, "color"),
    [attributeValues],
  );

  const sizeOptions = useMemo(
    () => getAttributeOptions(attributeValues, "size"),
    [attributeValues],
  );

  const syncVariantDrafts = (variants: ProductVariant[]) => {
    setVariantDrafts(createVariantDrafts(variants));
  };

  const resetSelectedProductState = () => {
    setSelectedProductSlug(null);
    setSelectedProductName("");
    setSelectedProductId(null);
    setSelectedVariants([]);
    setVariantDrafts({});
    setVariantFiles({});
  };

  const setCreateField =
    (field: keyof ProductFormState) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setCreateForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const setEditField =
    (field: keyof ProductFormState) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setEditForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleNewVariantField =
    (field: keyof VariantFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setNewVariantForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleNewVariantColor = (color: string) => {
    setNewVariantForm((prev) => ({ ...prev, color }));
  };

  const handleVariantDraftField =
    (variantId: number, field: keyof VariantFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setVariantDrafts((prev) => ({
        ...prev,
        [variantId]: {
          ...prev[variantId],
          [field]: event.target.value,
        },
      }));
    };

  const handleVariantDraftColor = (variantId: number, color: string) => {
    setVariantDrafts((prev) => ({
      ...prev,
      [variantId]: {
        ...prev[variantId],
        color,
      },
    }));
  };

  const refreshSelectedProduct = async (slug?: string) => {
    const targetSlug = slug || selectedProductSlug;
    if (!targetSlug) {
      return;
    }

    const productData = await fetchProductBySlug(targetSlug);
    if (!productData) {
      return;
    }

    setSelectedProductSlug(productData.slug);
    setSelectedProductName(productData.name ?? "");
    setSelectedProductId(productData.id ?? null);
    setSelectedVariants(productData.variants || []);
    syncVariantDrafts(productData.variants || []);
    setEditForm({
      category_id: String(productData.category_id ?? ""),
      name: productData.name ?? "",
      slug: productData.slug ?? "",
      base_price: String(productData.base_price ?? ""),
      description: productData.description ?? "",
    });
  };

  const loadProductForEdit = async (slug: string) => {
    await refreshSelectedProduct(slug);
    setVariantFiles({});
    setShowEditPanel(true);
  };

  const handleCreateColor = async () => {
    const trimmedColor = newColorValue.trim();
    if (!trimmedColor) {
      return;
    }

    const createdColor = await addAttributeOption({
      attribute_code: "color",
      value: trimmedColor,
    });

    setNewColorValue("");
    setNewVariantForm((prev) =>
      prev.color ? prev : { ...prev, color: createdColor.value },
    );
  };

  const handleCreateSize = async () => {
    const trimmedSize = newSizeValue.trim();
    if (!trimmedSize) {
      return;
    }

    const createdSize = await addAttributeOption({
      attribute_code: "size",
      value: trimmedSize,
    });

    setNewSizeValue("");
    setNewVariantForm((prev) =>
      prev.size ? prev : { ...prev, size: createdSize.value },
    );
  };

  const handleCreateProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await addProduct({
      category_id: Number(createForm.category_id),
      name: createForm.name.trim(),
      slug: createForm.slug.trim(),
      base_price: Number(createForm.base_price),
      description: createForm.description.trim(),
    });

    setCreateForm(emptyProductForm);
    setShowCreatePanel(false);
  };

  const handleSaveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProductSlug) {
      return;
    }

    const updated = await editProduct(selectedProductSlug, {
      category_id: Number(editForm.category_id),
      name: editForm.name.trim(),
      slug: editForm.slug.trim(),
      base_price: Number(editForm.base_price),
      description: editForm.description.trim(),
    });

    await refreshSelectedProduct(updated.slug || editForm.slug);
  };

  const handleDeleteProduct = async (slug: string) => {
    await removeProduct(slug);

    if (selectedProductSlug === slug) {
      resetSelectedProductState();
      setShowEditPanel(false);
    }
  };

  const requestDeleteProduct = (slug: string) => {
    setConfirmState({
      title: "Delete product?",
      message: `Product "${slug}" will be permanently deleted.`,
      confirmLabel: "Delete Product",
      onConfirm: () => handleDeleteProduct(slug),
    });
  };

  const handleAddVariant = async () => {
    if (!selectedProductId) {
      return;
    }

    const attributeValueIds = getVariantAttributeValueIds(
      {},
      attributeValues,
      {
        color: newVariantForm.color,
        size: newVariantForm.size,
      },
    );

    await addVariant({
      product_id: selectedProductId,
      sku: newVariantForm.sku.trim(),
      price: parseVariantPrice(newVariantForm.price),
      stock: Number(newVariantForm.stock),
      attribute_value_ids: attributeValueIds,
    });

    setNewVariantForm(emptyVariantForm);
    await refreshSelectedProduct();
    await fetchProducts();
  };

  const handleSaveVariant = async (variantId: number) => {
    const draft = variantDrafts[variantId];
    const variant = selectedVariants.find((item) => item.id === variantId);
    if (!draft || !selectedProductId || !variant) {
      return;
    }

    const attributeValueIds = getVariantAttributeValueIds(
      variant.attributes || {},
      attributeValues,
      {
        color: draft.color,
        size: draft.size,
      },
    );

    await editVariant(variantId, {
      product_id: selectedProductId,
      sku: draft.sku.trim(),
      price: parseVariantPrice(draft.price),
      stock: Number(draft.stock),
      attribute_value_ids: attributeValueIds,
    });

    await refreshSelectedProduct();
    await fetchProducts();
  };

  const handleDeleteVariant = async (variantId: number) => {
    await removeVariant(variantId);
    await refreshSelectedProduct();
    await fetchProducts();
  };

  const requestDeleteVariant = (variantId: number) => {
    setConfirmState({
      title: "Delete variant?",
      message: `Variant #${variantId} will be removed from this product.`,
      confirmLabel: "Delete Variant",
      onConfirm: () => handleDeleteVariant(variantId),
    });
  };

  const handleVariantFiles = (variantId: number, files: FileList | null) => {
    if (!files || files.length === 0) {
      setVariantFiles((prev) => ({ ...prev, [variantId]: [] }));
      return;
    }

    setVariantFiles((prev) => ({
      ...prev,
      [variantId]: Array.from(files),
    }));
  };

  const handleUploadVariantImages = async (
    variantId: number,
    existingImages: VariantImage[],
  ) => {
    const files = variantFiles[variantId] || [];
    if (files.length === 0) {
      return;
    }

    const nextOrderStart = getNextVariantImageOrder(existingImages);

    for (let index = 0; index < files.length; index += 1) {
      await addVariantImage(variantId, files[index], nextOrderStart + index);
    }

    setVariantFiles((prev) => ({ ...prev, [variantId]: [] }));
    await refreshSelectedProduct();
  };

  const handleDeleteVariantImage = async (imageId: number) => {
    await removeVariantImage(imageId);
    await refreshSelectedProduct();
  };

  const requestDeleteVariantImage = (imageId: number) => {
    setConfirmState({
      title: "Delete photo?",
      message: "This variant photo will be permanently removed.",
      confirmLabel: "Delete Photo",
      onConfirm: () => handleDeleteVariantImage(imageId),
    });
  };

  const handleMoveVariantImage = async (
    images: VariantImage[],
    imageId: number,
    direction: "earlier" | "later",
  ) => {
    const currentIndex = images.findIndex((image) => image.id === imageId);
    if (currentIndex < 0) {
      return;
    }

    const targetIndex =
      direction === "earlier" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= images.length) {
      return;
    }

    const reorderedImages = moveItem(images, currentIndex, targetIndex);
    await reorderVariantImages(reorderedImages);
    await refreshSelectedProduct();
  };

  const handleConfirmAction = async () => {
    if (!confirmState) {
      return;
    }

    try {
      await confirmState.onConfirm();
      setConfirmState(null);
    } catch (productError) {
      console.error("Confirmation action failed:", productError);
    }
  };

  return {
    actionLoading,
    catalog: {
      products,
      loading,
      error,
      page,
      limit,
      total,
      totalPages,
      firstItemNumber,
      lastItemNumber,
      fetchProducts,
      handleLimitChange: (nextLimit: number) => {
        setPage(1);
        setLimit(nextLimit);
      },
      goToPreviousPage: () => setPage((prev) => prev - 1),
      goToNextPage: () => setPage((prev) => prev + 1),
    },
    createPanel: {
      isOpen: showCreatePanel,
      form: createForm,
      toggle: () => setShowCreatePanel((prev) => !prev),
      close: () => setShowCreatePanel(false),
      onFieldChange: setCreateField,
      onSubmit: handleCreateProduct,
    },
    editPanel: {
      isOpen: showEditPanel && Boolean(selectedProductSlug),
      form: editForm,
      selectedProductName,
      close: () => setShowEditPanel(false),
      onFieldChange: setEditField,
      onSubmit: handleSaveProduct,
      loadProductForEdit,
    },
    variants: {
      variants: selectedVariants,
      basePrice: Number(editForm.base_price) || 0,
      availableColors: colorOptions,
      availableSizes: sizeOptions,
      newVariantForm,
      newColorValue,
      newSizeValue,
      variantDrafts,
      variantFiles,
      actionLoading,
      toAbsoluteImageUrl,
      onNewVariantField: handleNewVariantField,
      onNewVariantColor: handleNewVariantColor,
      onVariantDraftField: handleVariantDraftField,
      onVariantDraftColor: handleVariantDraftColor,
      onNewColorValue: (event: ChangeEvent<HTMLInputElement>) =>
        setNewColorValue(event.target.value),
      onNewSizeValue: (event: ChangeEvent<HTMLInputElement>) =>
        setNewSizeValue(event.target.value),
      onCreateColor: handleCreateColor,
      onCreateSize: handleCreateSize,
      onAddVariant: handleAddVariant,
      onSaveVariant: handleSaveVariant,
      onDeleteVariant: requestDeleteVariant,
      onVariantFiles: handleVariantFiles,
      onUploadVariantImages: handleUploadVariantImages,
      onDeleteVariantImage: requestDeleteVariantImage,
      onMoveVariantImage: handleMoveVariantImage,
    },
    confirmationDialog: {
      open: confirmState !== null,
      title: confirmState?.title || "",
      message: confirmState?.message || "",
      confirmLabel: confirmState?.confirmLabel || "Confirm",
      onCancel: () => setConfirmState(null),
      onConfirm: handleConfirmAction,
    },
    requestDeleteProduct,
  };
};
