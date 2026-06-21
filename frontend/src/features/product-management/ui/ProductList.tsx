"use client";

import { Category } from "@/entities/category/types";
import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { Loading } from "@/shared/ui/Loading";
import { SelectInput } from "@/shared/ui/Input";
import { useProductList } from "../model/useProductList";
import { ProductFormPanel } from "./components/ProductFormPanel";
import { ProductTable } from "./components/ProductTable";
import { VariantManager } from "./variant-manager/VariantManager";
import styles from "./ProductList.module.scss";

const ADMIN_EDIT_PRODUCT_FORM_ID = "admin-product-edit-form";

type ProductListProps = {
  categories: Category[];
};

export const ProductList = ({ categories }: ProductListProps) => {
  const {
    actionLoading,
    catalog,
    materials,
    createPanel,
    editPanel,
    variants,
    confirmationDialog,
    requestDeleteProduct,
  } = useProductList();

  const {
    products,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    hasMultiplePages,
    firstItemNumber,
    lastItemNumber,
    fetchProducts,
    handleLimitChange,
    goToPreviousPage,
    goToNextPage,
  } = catalog;

  return (
    <section className={styles.productList}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Product List</h1>
          <p className={styles.subtitle}>Manage catalog items in one place.</p>
        </div>
        <div className={styles.controls}>
          <Button onClick={createPanel.toggle}>
            {createPanel.isOpen ? "Close Create Form" : "Add Product"}
          </Button>
          <label className={styles.limitControl}>
            <span>Rows</span>
            <SelectInput
              className={styles.limitSelect}
              value={String(limit)}
              onChange={(event) => handleLimitChange(Number(event.target.value))}
              disabled={loading}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </SelectInput>
          </label>
          {hasMultiplePages ? (
            <span className={styles.pageChip}>
              Page {page} / {totalPages}
            </span>
          ) : null}
        </div>
      </div>

      {createPanel.isOpen && (
        <div className={styles.editPanel}>
          <ProductFormPanel
            title="Create Product"
            submitLabel="Create Product"
            form={createPanel.form}
            categories={categories}
            materials={materials}
            actionLoading={actionLoading}
            onSubmit={createPanel.onSubmit}
            onFieldChange={createPanel.onFieldChange}
            footerAction={
              <Button
                type="button"
                className={styles.actionButton}
                onClick={createPanel.close}
                disabled={actionLoading}
              >
                Cancel
              </Button>
            }
          />
        </div>
      )}

      {editPanel.isOpen && (
        <div className={styles.editPanel}>
          <div
            id="product-edit-top"
            className={styles.editScrollAnchor}
            tabIndex={-1}
            aria-hidden
          />
          <ProductFormPanel
            title={`Edit: ${editPanel.selectedProductName}`}
            submitLabel="Save product"
            form={editPanel.form}
            categories={categories}
            materials={materials}
            actionLoading={actionLoading}
            onSubmit={editPanel.onSubmit}
            onFieldChange={editPanel.onFieldChange}
            formId={ADMIN_EDIT_PRODUCT_FORM_ID}
            showFooterSubmit={false}
            compactLongFields
          />

          <VariantManager {...variants} />

          <div className={styles.editDock}>
            <p className={styles.editDockHint}>
              Save applies to product fields above. Each variant has its own Save
              when expanded.
            </p>
            <div className={styles.editDockRow}>
              <div className={styles.editDockLinks}>
                <a className={styles.editDockLink} href="#product-edit-top">
                  Product fields
                </a>
                <a className={styles.editDockLink} href="#product-variants-section">
                  Variants
                </a>
              </div>
              <div className={styles.editDockActions}>
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.actionButton}
                  onClick={editPanel.close}
                >
                  Close editor
                </Button>
                <Button
                  type="submit"
                  form={ADMIN_EDIT_PRODUCT_FORM_ID}
                  className={styles.actionButton}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Saving…" : "Save product"}
                </Button>
              </div>
            </div>
          </div>
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
            onEdit={editPanel.loadProductForEdit}
            onDelete={requestDeleteProduct}
          />

          <div className={styles.footer}>
            <p className={styles.counter}>
              Showing {firstItemNumber}-{lastItemNumber} of {total}
            </p>
            {hasMultiplePages ? (
              <div className={styles.pagination}>
                <Button
                  onClick={goToPreviousPage}
                  disabled={page <= 1 || loading}
                  className={styles.actionButton}
                >
                  Previous
                </Button>
                <Button
                  onClick={goToNextPage}
                  disabled={page >= totalPages || loading}
                  className={styles.actionButton}
                >
                  Next
                </Button>
              </div>
            ) : null}
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmationDialog.open}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        confirmLabel={confirmationDialog.confirmLabel}
        loading={actionLoading}
        onCancel={confirmationDialog.onCancel}
        onConfirm={confirmationDialog.onConfirm}
      />
    </section>
  );
};
