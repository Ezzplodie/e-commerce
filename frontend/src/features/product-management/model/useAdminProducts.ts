"use client";
import { useCallback, useEffect, useState } from "react";
import { Product } from "@/entities/product/types";
import { getProducts } from "../api/products.api";
export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      try {
        const productsResponse = await getProducts(limit, page, signal);
        setProducts(productsResponse.products);
        setError(null);
        setTotal(productsResponse.total);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Fetch aborted");
          return;
        }
        setError("Failed to fetch products");
        setLoading(false);
      }
    },
    [limit, page],
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    // eslint-disable-next-line
    fetchProducts(signal);
    return () => {
      controller.abort();
    };
  }, [page, limit, fetchProducts]);
  return {
    products,
    loading,
    page,
    limit,
    error,
    total,
    fetchProducts,
    setPage,
    setLimit,
  };
};
