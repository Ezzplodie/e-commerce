"use client";

import { useAdminCategories } from "@/features/category-management/model/useAdminCategories";
import { CategoryManager } from "@/features/category-management/ui/CategoryManager";
import { ProductList } from "@/features/product-management/ui/ProductList";

export default function AdminCatalog() {
  const {
    categories,
    loading,
    actionLoading,
    error,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
  } = useAdminCategories();

  return (
    <>
      <CategoryManager
        categories={categories}
        loading={loading}
        error={error}
        actionLoading={actionLoading}
        onRetry={fetchCategories}
        onCreateCategory={addCategory}
        onUpdateCategory={editCategory}
        onDeleteCategory={removeCategory}
      />
      <ProductList categories={categories} />
    </>
  );
}
