"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Category } from "@/entities/category/types";
import { CategoryFormState } from "../types";

const emptyCategoryForm: CategoryFormState = {
  name: "",
  slug: "",
};

type ConfirmState = {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void | Promise<void>;
};

type UseCategoryManagerStateParams = {
  onCreateCategory: (data: CategoryFormState) => Promise<Category>;
  onUpdateCategory: (
    slug: string,
    data: CategoryFormState,
  ) => Promise<Partial<CategoryFormState>>;
  onDeleteCategory: (slug: string) => Promise<void>;
};

export const useCategoryManagerState = ({
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}: UseCategoryManagerStateParams) => {
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

  return {
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
    confirmationDialog: {
      open: confirmState !== null,
      title: confirmState?.title || "",
      message: confirmState?.message || "",
      confirmLabel: confirmState?.confirmLabel || "Confirm",
      onCancel: () => setConfirmState(null),
      onConfirm: handleConfirmAction,
    },
  };
};
