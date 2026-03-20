"use client";

import { useCallback, useEffect, useState } from "react";
import { Product, VariantImage } from "@/entities/product/types";
import {
  createCategory,
  createProduct,
  createVariant,
  deleteCategory,
  deleteProduct,
  deleteVariant,
  deleteVariantImage,
  getCategories,
  getProductBySlug,
  getProducts,
  toAbsoluteImageUrl,
  updateProduct,
  updateCategory,
  updateVariantImage,
  updateVariant,
  uploadVariantImage,
} from "../api/products.api";
import {
  Category,
  CategoryDto,
  ProductDto,
  UpdateCategoryDto,
  UpdateProductDto,
  UpdateVariantDto,
  VariantDto,
} from "../types";

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProducts = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      try {
        const productsResponse = await getProducts(limit, page, signal);
        setProducts(productsResponse.products);
        setError(null);
        setTotal(productsResponse.total);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    },
    [limit, page],
  );

  const fetchCategories = useCallback(async () => {
    try {
      const categoriesResponse = await getCategories();
      setCategories(categoriesResponse);
    } catch {
      setError("Failed to fetch categories");
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

  const fetchProductBySlug = useCallback(async (slug: string) => {
    try {
      const productResponse = await getProductBySlug(slug);
      if (!productResponse) {
        setError("Product not found");
        return null;
      }
      return productResponse;
    } catch {
      setError("Failed to fetch product");
      return null;
    }
  }, []);

  const addProduct = useCallback(
    async (productData: ProductDto) => {
      setActionLoading(true);
      try {
        await createProduct(productData);
        await fetchProducts();
      } catch (_error) {
        setError("Failed to add product");
        throw _error;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchProducts],
  );

  const editProduct = useCallback(
    async (slug: string, productData: UpdateProductDto) => {
      setActionLoading(true);
      try {
        const updated = await updateProduct(slug, productData);
        await fetchProducts();
        return updated;
      } catch (_error) {
        setError("Failed to update product");
        throw _error;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchProducts],
  );

  const removeProduct = useCallback(
    async (slug: string) => {
      setActionLoading(true);
      try {
        await deleteProduct(slug);
        await fetchProducts();
      } catch (_error) {
        setError("Failed to delete product");
        throw _error;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchProducts],
  );

  const addVariant = useCallback(async (variantData: VariantDto) => {
    setActionLoading(true);
    try {
      return await createVariant(variantData);
    } catch (_error) {
      setError("Failed to add variant");
      throw _error;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const editVariant = useCallback(
    async (variantId: number, data: UpdateVariantDto) => {
      setActionLoading(true);
      try {
        return await updateVariant(variantId, data);
      } catch (_error) {
        setError("Failed to update variant");
        throw _error;
      } finally {
        setActionLoading(false);
      }
    },
    [],
  );

  const removeVariant = useCallback(async (variantId: number) => {
    setActionLoading(true);
    try {
      await deleteVariant(variantId);
    } catch (_error) {
      setError("Failed to delete variant");
      throw _error;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const addVariantImage = useCallback(
    async (variantId: number, file: File, imageOrder = 0) => {
      setActionLoading(true);
      try {
        return await uploadVariantImage(variantId, file, imageOrder);
      } catch (_error) {
        setError("Failed to upload image");
        throw _error;
      } finally {
        setActionLoading(false);
      }
    },
    [],
  );

  const removeVariantImage = useCallback(async (imageId: number) => {
    setActionLoading(true);
    try {
      await deleteVariantImage(imageId);
    } catch (_error) {
      setError("Failed to delete image");
      throw _error;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const reorderVariantImages = useCallback(async (images: VariantImage[]) => {
    setActionLoading(true);
    try {
      const updates = images
        .map((image, index) => {
          if (Number(image.image_order) === index) {
            return null;
          }

          return updateVariantImage(image.id, { image_order: index });
        })
        .filter(
          (request): request is Promise<VariantImage> => request !== null,
        );

      if (updates.length > 0) {
        await Promise.all(updates);
      }
    } catch (_error) {
      setError("Failed to reorder images");
      throw _error;
    } finally {
      setActionLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchProducts(signal);
    return () => {
      controller.abort();
    };
  }, [page, limit, fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    products,
    loading,
    page,
    limit,
    error,
    total,
    categories,
    actionLoading,
    fetchProducts,
    setPage,
    setLimit,
    fetchProductBySlug,
    addCategory,
    editCategory,
    removeCategory,
    addProduct,
    editProduct,
    removeProduct,
    addVariant,
    editVariant,
    removeVariant,
    addVariantImage,
    removeVariantImage,
    reorderVariantImages,
    toAbsoluteImageUrl,
  };
};
