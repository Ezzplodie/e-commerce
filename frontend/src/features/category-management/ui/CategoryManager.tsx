"use client";

import { Category } from "@/entities/category/types";
import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { Loading } from "@/shared/ui/Loading";
import { useCategoryManagerState } from "../model/useCategoryManagerState";
import { CategoryFormState } from "../types";
import { CategoryCreateForm } from "./components/CategoryCreateForm";
import { CategoryRow } from "./components/CategoryRow";
import styles from "./CategoryManager.module.scss";

type CategoryManagerProps = {
  categories: Category[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  onRetry: () => void | Promise<void>;
  onCreateCategory: (data: CategoryFormState) => Promise<Category>;
  onUpdateCategory: (
    slug: string,
    data: CategoryFormState,
  ) => Promise<Partial<CategoryFormState>>;
  onDeleteCategory: (slug: string) => Promise<void>;
};

export const CategoryManager = ({
  categories,
  loading,
  error,
  actionLoading,
  onRetry,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoryManagerProps) => {
  const {
    createForm,
    editForm,
    editingSlug,
    handleCreateField,
    handleEditField,
    startEditing,
    cancelEditing,
    handleSave,
    handleCreate,
    requestDeleteCategory,
    confirmationDialog,
  } = useCategoryManagerState({
    onCreateCategory,
    onUpdateCategory,
    onDeleteCategory,
  });

  return (
    <>
      <section className={styles.categorySection}>
        <div className={styles.categoryHeader}>
          <div>
            <h2 className={styles.categoryTitle}>Categories</h2>
            <p className={styles.categorySubtitle}>
              Create, rename, and remove product categories.
            </p>
          </div>
          <span className={styles.categoryCountChip}>
            {categories.length} categor{categories.length === 1 ? "y" : "ies"}
          </span>
        </div>

        <CategoryCreateForm
          form={createForm}
          actionLoading={actionLoading}
          onSubmit={handleCreate}
          onFieldChange={handleCreateField}
        />

        {loading && (
          <div className={styles.stateCard}>
            <Loading size="md" label="Loading categories" />
          </div>
        )}

        {!loading && error && (
          <div className={styles.stateCard}>
            <p className={styles.stateTitle}>Couldn&apos;t load categories.</p>
            <p className={styles.stateText}>{error}</p>
            <Button
              type="button"
              className={styles.actionButton}
              onClick={onRetry}
              disabled={actionLoading}
            >
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && (
          <div className={styles.categoryList}>
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                isEditing={editingSlug === category.slug}
                editForm={editForm}
                actionLoading={actionLoading}
                onEditField={handleEditField}
                onStartEditing={startEditing}
                onCancelEditing={cancelEditing}
                onSave={handleSave}
                onRequestDelete={requestDeleteCategory}
              />
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={confirmationDialog.open}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        confirmLabel={confirmationDialog.confirmLabel}
        loading={actionLoading}
        onCancel={confirmationDialog.onCancel}
        onConfirm={confirmationDialog.onConfirm}
      />
    </>
  );
};
