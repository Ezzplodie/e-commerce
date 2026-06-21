"use client";

import { ChangeEvent, FormEvent, ReactNode } from "react";
import { Category } from "@/entities/category/types";
import { Button } from "@/shared/ui/Button";
import { SelectInput, TextInput } from "@/shared/ui/Input";
import { Material, ProductFormState } from "../../types";
import styles from "../ProductList.module.scss";

type ProductFormPanelProps = {
  title: string;
  submitLabel: string;
  form: ProductFormState;
  categories: Category[];
  materials: Material[];
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
  /** Associates external submit buttons (e.g. sticky bar) with this form. */
  formId?: string;
  /** When false, omit the primary submit row (use an external `form={formId}` button). */
  showFooterSubmit?: boolean;
  /** Collapse long PDP text fields behind a disclosure to shorten the edit view. */
  compactLongFields?: boolean;
};

export const ProductFormPanel = ({
  title,
  submitLabel,
  form,
  categories,
  materials,
  actionLoading,
  onSubmit,
  onFieldChange,
  headerAction,
  footerAction,
  formId,
  showFooterSubmit = true,
  compactLongFields = false,
}: ProductFormPanelProps) => {
  const longFields = (
    <>
      <label className={styles.field}>
        <span>Description</span>
        <textarea
          className={styles.textArea}
          value={form.description}
          onChange={onFieldChange("description")}
          placeholder="Short product description"
        />
      </label>

      <label className={styles.field}>
        <span>Fitting</span>
        <textarea
          className={styles.textArea}
          value={form.fitting}
          onChange={onFieldChange("fitting")}
          placeholder="Fit notes (e.g. relaxed, true to size)"
        />
      </label>

      <label className={styles.field}>
        <span>Product detail</span>
        <textarea
          className={styles.textArea}
          value={form.product_detail}
          onChange={onFieldChange("product_detail")}
          placeholder="Longer product details for PDP"
        />
      </label>

      <label className={styles.field}>
        <span>Fabric care</span>
        <textarea
          className={styles.textArea}
          value={form.fabric_care}
          onChange={onFieldChange("fabric_care")}
          placeholder="Washing and care instructions"
        />
      </label>
    </>
  );

  return (
    <form
      id={formId}
      className={styles.productEditorForm}
      onSubmit={onSubmit}
    >
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
        <label className={styles.field}>
          <span>Material</span>
          <SelectInput
            value={form.material_id}
            onChange={onFieldChange("material_id")}
            className={styles.adminSelect}
          >
            <option value="">None</option>
            {materials.map((material) => (
              <option key={material.id} value={material.id}>
                {material.name}
              </option>
            ))}
          </SelectInput>
        </label>
      </div>

      {compactLongFields ? (
        <details className={styles.extendedFieldsDetails}>
          <summary className={styles.extendedFieldsSummary}>
            Extended PDP copy (description, fitting, details, care)
          </summary>
          <div className={styles.extendedFieldsBody}>{longFields}</div>
        </details>
      ) : (
        longFields
      )}

      {showFooterSubmit && (
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
      )}
    </form>
  );
};
