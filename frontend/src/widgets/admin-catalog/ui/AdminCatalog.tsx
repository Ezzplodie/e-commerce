"use client";

import {
  CategoryManager,
  useAdminCategories,
} from "@/features/category-management";
import { ProductList } from "@/features/product-management";
import styles from "./AdminCatalog.module.scss";

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
    <div className={styles.page}>
      <header className={styles.intro}>
        <h1 className={styles.title}>Catalog</h1>
        <p className={styles.subtitle}>
          Manage categories, products, variants, and media for the storefront.
        </p>
      </header>
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
