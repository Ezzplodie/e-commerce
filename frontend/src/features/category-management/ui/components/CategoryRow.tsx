"use client";

import { ChangeEvent } from "react";
import { Category } from "@/entities/category/types";
import { Button } from "@/shared/ui/Button";
import { TextInput } from "@/shared/ui/Input";
import { CategoryFormState } from "../../types";
import styles from "../CategoryManager.module.scss";

type CategoryRowProps = {
  category: Category;
  isEditing: boolean;
  editForm: Partial<CategoryFormState>;
  actionLoading: boolean;
  onEditField: (
    field: keyof CategoryFormState,
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  onStartEditing: (category: Category) => void;
  onCancelEditing: () => void;
  onSave: (slug: string) => void | Promise<void>;
  onRequestDelete: (slug: string) => void;
};

export const CategoryRow = ({
  category,
  isEditing,
  editForm,
  actionLoading,
  onEditField,
  onStartEditing,
  onCancelEditing,
  onSave,
  onRequestDelete,
}: CategoryRowProps) => {
  return (
    <article className={styles.categoryRow}>
      {isEditing ? (
        <div className={styles.categoryEditGrid}>
          <label className={styles.field}>
            <span>Name</span>
            <TextInput
              value={editForm.name}
              onChange={onEditField("name")}
              className={styles.adminInput}
            />
          </label>
          <label className={styles.field}>
            <span>Slug</span>
            <TextInput
              value={editForm.slug}
              onChange={onEditField("slug")}
              className={styles.adminInput}
            />
          </label>
          <div className={styles.categoryActions}>
            <Button
              className={styles.compactButton}
              onClick={() => onSave(category.slug)}
              disabled={actionLoading}
            >
              Save
            </Button>
            <Button
              className={styles.actionButton}
              onClick={onCancelEditing}
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
              onClick={() => onStartEditing(category)}
              disabled={actionLoading}
            >
              Edit
            </Button>
            <Button
              className={styles.deleteButton}
              onClick={() => onRequestDelete(category.slug)}
              disabled={actionLoading}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </article>
  );
};
