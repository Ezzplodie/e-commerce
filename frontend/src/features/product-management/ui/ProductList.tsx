"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { ProductVariant, VariantImage } from "@/entities/product/types";
import { Button } from "@/shared/ui/Button";
import { Loading } from "@/shared/ui/Loading";
import { SelectInput } from "@/shared/ui/Input";
import { useAdminProducts } from "../model/useAdminProducts";
import {
  CategoryFormState,
  ProductFormState,
  VariantFormState,
} from "../types";
import { CategoryManager } from "./components/CategoryManager";
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

export const ProductList = () => {
  const {
    products,
    loading,
    error,
    page,
    limit,
    total,
    categories,
    actionLoading,
    fetchProducts,
    setPage,
    setLimit,
    fetchProductBySlug,
    addCategory,
    editCategory,
    removeCategory,
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

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const firstItemNumber = products.length ? (page - 1) * limit + 1 : 0;
  const lastItemNumber = products.length
    ? Math.min((page - 1) * limit + products.length, total)
    : 0;

  const syncVariantDrafts = (
    variants: Array<{
      id: number;
      sku: string;
      price: number;
      stock: number;
    }>,
  ) => {
    const nextDrafts: Record<number, VariantFormState> = {};
    for (const variant of variants) {
      nextDrafts[variant.id] = {
        sku: variant.sku || "",
        price: String(variant.price ?? ""),
        stock: String(variant.stock ?? 0),
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
    (event: ChangeEvent<HTMLInputElement>) => {
      setNewVariantForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleVariantDraftField =
    (variantId: number, field: keyof VariantFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setVariantDrafts((prev) => ({
        ...prev,
        [variantId]: {
          ...prev[variantId],
          [field]: event.target.value,
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

  const handleCreateCategory = async (payload: CategoryFormState) => {
    await addCategory(payload);
  };

  const handleUpdateCategory = async (
    slug: string,
    payload: Partial<CategoryFormState>,
  ) => {
    await editCategory(slug, payload);
  };

  const handleDeleteCategory = async (slug: string) => {
    await removeCategory(slug);
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

  const handleAddVariant = async () => {
    if (!selectedProductId) {
      return;
    }

    await addVariant({
      product_id: selectedProductId,
      sku: newVariantForm.sku.trim(),
      price: Number(newVariantForm.price),
      stock: Number(newVariantForm.stock),
      attribute_value_ids: [],
    });

    setNewVariantForm(emptyVariantForm);
    await refreshSelectedProduct();
    await fetchProducts();
  };

  const handleSaveVariant = async (variantId: number) => {
    const draft = variantDrafts[variantId];
    if (!draft || !selectedProductId) {
      return;
    }

    await editVariant(variantId, {
      product_id: selectedProductId,
      sku: draft.sku.trim(),
      price: Number(draft.price),
      stock: Number(draft.stock),
      attribute_value_ids: [],
    });

    await refreshSelectedProduct();
    await fetchProducts();
  };

  const handleDeleteVariant = async (variantId: number) => {
    await removeVariant(variantId);
    await refreshSelectedProduct();
    await fetchProducts();
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

      <CategoryManager
        categories={categories}
        actionLoading={actionLoading}
        onCreateCategory={handleCreateCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

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
            newVariantForm={newVariantForm}
            variantDrafts={variantDrafts}
            variantFiles={variantFiles}
            actionLoading={actionLoading}
            toAbsoluteImageUrl={toAbsoluteImageUrl}
            onNewVariantField={handleNewVariantField}
            onVariantDraftField={handleVariantDraftField}
            onAddVariant={handleAddVariant}
            onSaveVariant={handleSaveVariant}
            onDeleteVariant={handleDeleteVariant}
            onVariantFiles={handleVariantFiles}
            onUploadVariantImages={handleUploadVariantImages}
            onDeleteVariantImage={handleDeleteVariantImage}
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
            onDelete={handleDeleteProduct}
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
    </section>
  );
};
