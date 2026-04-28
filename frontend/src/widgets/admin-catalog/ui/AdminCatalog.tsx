"use client";

import {
  CategoryManager,
  useAdminCategories,
} from "@/features/category-management";
import { ProductList } from "@/features/product-management";

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
    <div className="container">
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
    </div>
  );
}
