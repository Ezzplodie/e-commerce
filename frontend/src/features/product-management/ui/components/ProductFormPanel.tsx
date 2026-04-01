"use client";

import { ChangeEvent, FormEvent, ReactNode } from "react";
import { Category } from "@/entities/category/types";
import { Button } from "@/shared/ui/Button";
import { SelectInput, TextInput } from "@/shared/ui/Input";
import { ProductFormState } from "../../types";
import styles from "../ProductList.module.scss";

type ProductFormPanelProps = {
  title: string;
  submitLabel: string;
  form: ProductFormState;
  categories: Category[];
  actionLoading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onFieldChange: (
    field: keyof ProductFormState,
  ) => (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  headerAction?: ReactNode;
  footerAction?: ReactNode;
};

export const ProductFormPanel = ({
  title,
  submitLabel,
  form,
  categories,
  actionLoading,
  onSubmit,
  onFieldChange,
  headerAction,
  footerAction,
}: ProductFormPanelProps) => {
  return (
    <form className={styles.productEditorForm} onSubmit={onSubmit}>
      <div className={styles.editHeader}>
        <h2 className={styles.editTitle}>{title}</h2>
        {headerAction}
      </div>

      <div className={styles.editGrid}>
        <label className={styles.field}>
          <span>Product Name</span>
          <TextInput
            value={form.name}
            onChange={onFieldChange("name")}
            placeholder="e.g. Basic T-shirt"
            className={styles.adminInput}
            required
          />
        </label>
        <label className={styles.field}>
          <span>Slug</span>
          <TextInput
            value={form.slug}
            onChange={onFieldChange("slug")}
            placeholder="e.g. basic-t-shirt"
            className={styles.adminInput}
            required
          />
        </label>
        <label className={styles.field}>
          <span>Base Price</span>
          <TextInput
            type="number"
            value={form.base_price}
            onChange={onFieldChange("base_price")}
            placeholder="0.002"
            className={styles.adminInput}
            required
          />
        </label>
        <label className={styles.field}>
          <span>Category</span>
          <SelectInput
            value={form.category_id}
            onChange={onFieldChange("category_id")}
            className={styles.adminSelect}
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </SelectInput>
        </label>
      </div>

      <label className={styles.field}>
        <span>Description</span>
        <textarea
          className={styles.textArea}
          value={form.description}
          onChange={onFieldChange("description")}
          placeholder="Short product description"
        />
      </label>

      <div className={styles.editActions}>
        {footerAction}
        <Button
          type="submit"
          className={styles.actionButton}
          disabled={actionLoading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
