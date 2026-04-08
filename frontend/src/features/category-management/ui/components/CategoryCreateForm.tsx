"use client";

import { ChangeEvent, FormEvent } from "react";
import { Button } from "@/shared/ui/Button";
import { TextInput } from "@/shared/ui/Input";
import { CategoryFormState } from "../../types";
import styles from "../CategoryManager.module.scss";

type CategoryCreateFormProps = {
  form: CategoryFormState;
  actionLoading: boolean;
  onSubmit: (event: FormEvent) => void | Promise<void>;
  onFieldChange: (
    field: keyof CategoryFormState,
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
};

export const CategoryCreateForm = ({
  form,
  actionLoading,
  onSubmit,
  onFieldChange,
}: CategoryCreateFormProps) => {
  return (
    <form className={styles.categoryCreateForm} onSubmit={onSubmit}>
      <label className={styles.field}>
        <span>Name</span>
        <TextInput
          value={form.name}
          onChange={onFieldChange("name")}
          placeholder="e.g. Men"
          className={styles.adminInput}
          required
        />
      </label>
      <label className={styles.field}>
        <span>Slug</span>
        <TextInput
          value={form.slug}
          onChange={onFieldChange("slug")}
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
  );
};
