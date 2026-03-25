"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/shared/ui/Button";
import { TextInput } from "@/shared/ui/Input";
import { Category, CategoryFormState } from "../../types";
import styles from "../ProductList.module.scss";

const emptyCategoryForm: CategoryFormState = {
  name: "",
  slug: "",
};

type CategoryManagerProps = {
  categories: Category[];
  actionLoading: boolean;
  onCreateCategory: (data: CategoryFormState) => Promise<Category>;
  onUpdateCategory: (
    slug: string,
    data: CategoryFormState,
  ) => Promise<Partial<CategoryFormState>>;
  onDeleteCategory: (slug: string) => Promise<void>;
};
export const CategoryManager = ({
  categories,
  actionLoading,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoryManagerProps) => {
  const [createForm, setCreateForm] = useState(emptyCategoryForm);
  const [editForm, setEditForm] = useState<Partial<CategoryFormState>>({});
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const handleCreateField =
    (field: keyof CategoryFormState) => (e: ChangeEvent<HTMLInputElement>) => {
      setCreateForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  const handleEditField =
    (field: keyof CategoryFormState) => (e: ChangeEvent<HTMLInputElement>) => {
      setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
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
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await onCreateCategory(createForm);
      setCreateForm(emptyCategoryForm);
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };
  return (
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
          className={styles.compactButton}
          disabled={actionLoading}
        >
          Add Category
        </Button>
      </form>

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
                      onClick={() => onDeleteCategory(category.slug)}
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
    </section>
  );
};
