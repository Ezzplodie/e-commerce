"use client";

import Link from "next/link";
import {
  CategoryManager,
  useAdminCategories,
} from "@/features/category-management";
import { ProductList } from "@/features/product-management";
import { Button } from "@/shared/ui/Button";
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
      <div className="container">
        <div className={styles.topBar}>
          <Link href="/">
            <Button className={styles.backButton} variant="secondary">
              Back to home
            </Button>
          </Link>
        </div>
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
    </div>
  );
}
