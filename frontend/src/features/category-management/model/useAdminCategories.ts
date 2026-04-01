"use client";

import { useCallback, useEffect, useState } from "react";
import { Category } from "@/entities/category/types";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../api/categories.api";
import { CategoryDto, UpdateCategoryDto } from "../types";

export const useAdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const categoriesResponse = await getCategories();
      setCategories(categoriesResponse);
      setError(null);
    } catch {
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(
    async (categoryData: CategoryDto) => {
      setActionLoading(true);
      try {
        const createdCategory = await createCategory(categoryData);
        await fetchCategories();
        return createdCategory;
      } catch (_error) {
        setError("Failed to add category");
        throw _error;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchCategories],
  );

  const editCategory = useCallback(
    async (slug: string, categoryData: UpdateCategoryDto) => {
      setActionLoading(true);
      try {
        const updatedCategory = await updateCategory(slug, categoryData);
        await fetchCategories();
        return updatedCategory;
      } catch (_error) {
        setError("Failed to update category");
        throw _error;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchCategories],
  );

  const removeCategory = useCallback(
    async (slug: string) => {
      setActionLoading(true);
      try {
        await deleteCategory(slug);
        await fetchCategories();
      } catch (_error) {
        setError("Failed to delete category");
        throw _error;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchCategories],
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    actionLoading,
    error,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
  };
};
