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

type ProductListProps = {
  categories: Category[];
};

export const ProductList = ({ categories }: ProductListProps) => {
  const {
    actionLoading,
    catalog,
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
          <span className={styles.pageChip}>
            Page {page} / {totalPages}
          </span>
        </div>
      </div>

      {createPanel.isOpen && (
        <div className={styles.editPanel}>
          <ProductFormPanel
            title="Create Product"
            submitLabel="Create Product"
            form={createPanel.form}
            categories={categories}
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
          <ProductFormPanel
            title={`Edit Product: ${editPanel.selectedProductName}`}
            submitLabel="Save Changes"
            form={editPanel.form}
            categories={categories}
            actionLoading={actionLoading}
            onSubmit={editPanel.onSubmit}
            onFieldChange={editPanel.onFieldChange}
            headerAction={
              <Button
                type="button"
                className={styles.actionButton}
                onClick={editPanel.close}
              >
                Close
              </Button>
            }
          />

          <VariantManager {...variants} />
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
