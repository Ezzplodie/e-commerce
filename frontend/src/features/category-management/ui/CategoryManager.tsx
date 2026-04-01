"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Category } from "@/entities/category/types";
import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { TextInput } from "@/shared/ui/Input";
import { Loading } from "@/shared/ui/Loading";
import { CategoryFormState } from "../types";
import styles from "./CategoryManager.module.scss";

const emptyCategoryForm: CategoryFormState = {
  name: "",
  slug: "",
};

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

type ConfirmState = {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void | Promise<void>;
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
  const [createForm, setCreateForm] = useState(emptyCategoryForm);
  const [editForm, setEditForm] = useState<Partial<CategoryFormState>>({});
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const handleCreateField =
    (field: keyof CategoryFormState) => (event: ChangeEvent<HTMLInputElement>) => {
      setCreateForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleEditField =
    (field: keyof CategoryFormState) => (event: ChangeEvent<HTMLInputElement>) => {
      setEditForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const startEditing = (category: Category) => {
    setEditingSlug(category.slug);
    setEditForm({ name: category.name, slug: category.slug });
  };

  const cancelEditing = () => {
    setEditingSlug(null);
    setEditForm({});
  };

  const handleSave = async (originalSlug: string) => {
    if (!editForm.name || !editForm.slug) {
      return;
    }

    try {
      await onUpdateCategory(originalSlug, editForm as CategoryFormState);
      cancelEditing();
    } catch (categoryError) {
      console.error("Failed to update category:", categoryError);
    }
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await onCreateCategory(createForm);
      setCreateForm(emptyCategoryForm);
    } catch (categoryError) {
      console.error("Failed to create category:", categoryError);
    }
  };

  const requestDeleteCategory = (slug: string) => {
    setConfirmState({
      title: "Delete category?",
      message: `Category "${slug}" will be removed. This action cannot be undone.`,
      confirmLabel: "Delete Category",
      onConfirm: () => onDeleteCategory(slug),
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmState) {
      return;
    }

    try {
      await confirmState.onConfirm();
      setConfirmState(null);
    } catch (categoryError) {
      console.error("Failed to confirm category action:", categoryError);
    }
  };

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

        <form className={styles.categoryCreateForm} onSubmit={handleCreate}>
          <label className={styles.field}>
            <span>Name</span>
            <TextInput
              value={createForm.name}
              onChange={handleCreateField("name")}
              placeholder="e.g. Men"
              className={styles.adminInput}
              required
            />
          </label>
          <label className={styles.field}>
            <span>Slug</span>
            <TextInput
              value={createForm.slug}
              onChange={handleCreateField("slug")}
              placeholder="e.g. men"
              className={styles.adminInput}
              required
            />
          </label>
          <Button
            type="submit"
            className={`${styles.actionButton} ${styles.compactButton}`}
            disabled={actionLoading}
          >
            Add Category
          </Button>
        </form>

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
            {categories.map((category) => {
              const isEditing = editingSlug === category.slug;

              return (
                <article key={category.id} className={styles.categoryRow}>
                  {isEditing ? (
                    <div className={styles.categoryEditGrid}>
                      <label className={styles.field}>
                        <span>Name</span>
                        <TextInput
                          value={editForm.name}
                          onChange={handleEditField("name")}
                          className={styles.adminInput}
                        />
                      </label>
                      <label className={styles.field}>
                        <span>Slug</span>
                        <TextInput
                          value={editForm.slug}
                          onChange={handleEditField("slug")}
                          className={styles.adminInput}
                        />
                      </label>
                      <div className={styles.categoryActions}>
                        <Button
                          className={styles.compactButton}
                          onClick={() => handleSave(category.slug)}
                          disabled={actionLoading}
                        >
                          Save
                        </Button>
                        <Button
                          className={styles.actionButton}
                          onClick={cancelEditing}
                          disabled={actionLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.categoryDisplayRow}>
                      <div className={styles.categoryInfo}>
                        <p className={styles.categoryName}>{category.name}</p>
                        <p className={styles.categorySlug}>{category.slug}</p>
                      </div>
                      <div className={styles.categoryActions}>
                        <Button
                          className={styles.editButton}
                          onClick={() => startEditing(category)}
                          disabled={actionLoading}
                        >
                          Edit
                        </Button>
                        <Button
                          className={styles.deleteButton}
                          onClick={() => requestDeleteCategory(category.slug)}
                          disabled={actionLoading}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={confirmState !== null}
        title={confirmState?.title || ""}
        message={confirmState?.message || ""}
        confirmLabel={confirmState?.confirmLabel || "Confirm"}
        loading={actionLoading}
        onCancel={() => setConfirmState(null)}
        onConfirm={handleConfirmAction}
      />
    </>
  );
};
