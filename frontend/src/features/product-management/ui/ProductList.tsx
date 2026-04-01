"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Category } from "@/entities/category/types";
import { ProductVariant, VariantImage } from "@/entities/product/types";
import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { Loading } from "@/shared/ui/Loading";
import { SelectInput } from "@/shared/ui/Input";
import { useAdminProducts } from "../model/useAdminProducts";
import { AttributeValue, ProductFormState, VariantFormState } from "../types";
import { ProductFormPanel } from "./components/ProductFormPanel";
import { ProductTable } from "./components/ProductTable";
import { VariantManager } from "./components/VariantManager";
import styles from "./ProductList.module.scss";

const emptyProductForm: ProductFormState = {
  category_id: "",
  name: "",
  slug: "",
  base_price: "",
  description: "",
};

const emptyVariantForm: VariantFormState = {
  sku: "",
  price: "",
  stock: "0",
  color: "",
  size: "",
};

const moveItem = <T,>(items: T[], fromIndex: number, toIndex: number) => {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);

  if (movedItem === undefined) {
    return nextItems;
  }

  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
};

const normalizeAttributeText = (value: string | null | undefined) =>
  value?.trim().toLowerCase() ?? "";

const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const getSizeSortRank = (size: string) => {
  const rank = SIZE_ORDER.indexOf(size.toUpperCase());
  return rank === -1 ? Number.POSITIVE_INFINITY : rank;
};

const compareAttributeValues = (attributeCode: string, a: string, b: string) => {
  if (attributeCode === "size") {
    const rankDiff = getSizeSortRank(a) - getSizeSortRank(b);
    if (rankDiff !== 0) {
      return rankDiff;
    }
  }

  return a.localeCompare(b, undefined, { sensitivity: "base" });
};

const parseVariantPrice = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const parsedValue = Number(trimmedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const getVariantAttributeValueIds = (
  attributes: Record<string, string>,
  attributeValues: AttributeValue[],
  overrides: Partial<Record<"color" | "size", string>>,
) => {
  const nextAttributes = new Map<string, string>();
  // clear and normalize upcoming attributes
  for (const [code, value] of Object.entries(attributes || {})) {
    const normalizedCode = normalizeAttributeText(code);
    const trimmedValue = value?.trim();

    if (!normalizedCode || !trimmedValue) {
      continue;
    }

    nextAttributes.set(normalizedCode, trimmedValue);
  }

  for (const [code, value] of Object.entries(overrides)) {
    const normalizedCode = normalizeAttributeText(code);
    const trimmedValue = value?.trim();

    if (!normalizedCode) {
      continue;
    }

    if (trimmedValue) {
      nextAttributes.set(normalizedCode, trimmedValue);
    } else {
      nextAttributes.delete(normalizedCode);
    }
  }

  return Array.from(nextAttributes.entries()).flatMap(([code, value]) => {
    const matchedValue = attributeValues.find(
      (attributeValue) =>
        attributeValue.attribute_code === code &&
        normalizeAttributeText(attributeValue.value) ===
          normalizeAttributeText(value),
    );

    return matchedValue ? [matchedValue.id] : [];
  });
};

type ConfirmState = {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void | Promise<void>;
};

type ProductListProps = {
  categories: Category[];
};

export const ProductList = ({ categories }: ProductListProps) => {
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

  const colorOptions = useMemo(() => {
    const uniqueColors = new Map<string, string>();

    for (const attributeValue of attributeValues) {
      if (attributeValue.attribute_code !== "color") {
        continue;
      }

      const normalizedColor = normalizeAttributeText(attributeValue.value);
      if (!normalizedColor || uniqueColors.has(normalizedColor)) {
        continue;
      }

      uniqueColors.set(normalizedColor, attributeValue.value);
    }

    return Array.from(uniqueColors.values());
  }, [attributeValues]);

  const sizeOptions = useMemo(() => {
    const uniqueSizes = new Map<string, string>();

    for (const attributeValue of attributeValues) {
      if (attributeValue.attribute_code !== "size") {
        continue;
      }

      const normalizedSize = normalizeAttributeText(attributeValue.value);
      if (!normalizedSize || uniqueSizes.has(normalizedSize)) {
        continue;
      }

      uniqueSizes.set(normalizedSize, attributeValue.value);
    }

    return Array.from(uniqueSizes.values()).sort((a, b) =>
      compareAttributeValues("size", a, b),
    );
  }, [attributeValues]);

  const syncVariantDrafts = (variants: ProductVariant[]) => {
    const nextDrafts: Record<number, VariantFormState> = {};
    for (const variant of variants) {
      nextDrafts[variant.id] = {
        sku: variant.sku || "",
        price: String(variant.price ?? ""),
        stock: String(variant.stock ?? 0),
        color: variant.attributes?.color ?? "",
        size: variant.attributes?.size ?? "",
      };
    }
    setVariantDrafts(nextDrafts);
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
      setSelectedProductSlug(null);
      setSelectedProductName("");
      setSelectedProductId(null);
      setSelectedVariants([]);
      setVariantDrafts({});
      setVariantFiles({});
      setShowEditPanel(false);
    }
  };

  const requestDeleteProduct = async (slug: string) => {
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

  const requestDeleteVariant = async (variantId: number) => {
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

    const nextOrderStart =
      existingImages.reduce(
        (highestOrder, image) =>
          Math.max(highestOrder, Number(image.image_order) || 0),
        -1,
      ) + 1;

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

  const requestDeleteVariantImage = async (imageId: number) => {
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
    } catch (error) {
      console.error("Confirmation action failed:", error);
    }
  };

  return (
    <section className={styles.productList}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Product List</h1>
          <p className={styles.subtitle}>Manage catalog items in one place.</p>
        </div>
        <div className={styles.controls}>
          <Button onClick={() => setShowCreatePanel((prev) => !prev)}>
            {showCreatePanel ? "Close Create Form" : "Add Product"}
          </Button>
          <label className={styles.limitControl}>
            <span>Rows</span>
            <SelectInput
              className={styles.limitSelect}
              value={String(limit)}
              onChange={(event) => {
                setPage(1);
                setLimit(Number(event.target.value));
              }}
              disabled={loading}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </SelectInput>
          </label>
          <span className={styles.pageChip}>
            Page {page} / {totalPages}
          </span>
        </div>
      </div>

      {showCreatePanel && (
        <div className={styles.editPanel}>
          <ProductFormPanel
            title="Create Product"
            submitLabel="Create Product"
            form={createForm}
            categories={categories}
            actionLoading={actionLoading}
            onSubmit={handleCreateProduct}
            onFieldChange={setCreateField}
            footerAction={
              <Button
                type="button"
                className={styles.actionButton}
                onClick={() => setShowCreatePanel(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
            }
          />
        </div>
      )}

      {showEditPanel && selectedProductSlug && (
        <div className={styles.editPanel}>
          <ProductFormPanel
            title={`Edit Product: ${selectedProductName}`}
            submitLabel="Save Changes"
            form={editForm}
            categories={categories}
            actionLoading={actionLoading}
            onSubmit={handleSaveProduct}
            onFieldChange={setEditField}
            headerAction={
              <Button
                type="button"
                className={styles.actionButton}
                onClick={() => setShowEditPanel(false)}
              >
                Close
              </Button>
            }
          />

          <VariantManager
            variants={selectedVariants}
            basePrice={Number(editForm.base_price) || 0}
            availableColors={colorOptions}
            availableSizes={sizeOptions}
            newVariantForm={newVariantForm}
            newColorValue={newColorValue}
            newSizeValue={newSizeValue}
            variantDrafts={variantDrafts}
            variantFiles={variantFiles}
            actionLoading={actionLoading}
            toAbsoluteImageUrl={toAbsoluteImageUrl}
            onNewVariantField={handleNewVariantField}
            onNewVariantColor={handleNewVariantColor}
            onVariantDraftField={handleVariantDraftField}
            onVariantDraftColor={handleVariantDraftColor}
            onNewColorValue={(event) => setNewColorValue(event.target.value)}
            onNewSizeValue={(event) => setNewSizeValue(event.target.value)}
            onCreateColor={handleCreateColor}
            onCreateSize={handleCreateSize}
            onAddVariant={handleAddVariant}
            onSaveVariant={handleSaveVariant}
            onDeleteVariant={requestDeleteVariant}
            onVariantFiles={handleVariantFiles}
            onUploadVariantImages={handleUploadVariantImages}
            onDeleteVariantImage={requestDeleteVariantImage}
            onMoveVariantImage={handleMoveVariantImage}
          />
        </div>
      )}

      {loading && (
        <div className={styles.stateCard}>
          <Loading size="lg" label="Loading products" />
        </div>
      )}

      {!loading && error && (
        <div className={styles.stateCard}>
          <p className={styles.stateTitle}>Couldn&apos;t load products.</p>
          <p className={styles.stateText}>{error}</p>
          <Button
            onClick={() => fetchProducts()}
            className={styles.actionButton}
          >
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className={styles.stateCard}>
          <p className={styles.stateTitle}>No products yet</p>
          <p className={styles.stateText}>
            Add your first product to start building the catalog.
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <ProductTable
            products={products}
            onEdit={loadProductForEdit}
            onDelete={requestDeleteProduct}
          />

          <div className={styles.footer}>
            <p className={styles.counter}>
              Showing {firstItemNumber}-{lastItemNumber} of {total}
            </p>
            <div className={styles.pagination}>
              <Button
                onClick={() => setPage((prev) => prev - 1)}
                disabled={page <= 1 || loading}
                className={styles.actionButton}
              >
                Previous
              </Button>
              <Button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page >= totalPages || loading}
                className={styles.actionButton}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmState !== null}
        title={confirmState?.title || ""}
        message={confirmState?.message || ""}
        confirmLabel={confirmState?.confirmLabel || "Confirm"}
        loading={actionLoading}
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirmAction}
      />
    </section>
  );
};
