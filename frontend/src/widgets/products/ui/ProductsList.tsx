"use client";
import styles from "./ProductsPage.module.scss";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductsListResponse } from "@/entities/product/types";
import { getProductsByQuery } from "@/entities/product/api";
import { ProductCard, ProductCardSkeleton } from "@/shared/ui/ProductCard";
import { getProductCardImage } from "@/entities/product";
import {
  clampPage,
  getTotalPages,
  shouldShowPagination,
} from "@/shared/lib/pagination";

export function ProductsList() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductsListResponse>({
    products: [],
    page: 1,
    limit: 5,
    total: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const searchString = useMemo(() => searchParams.toString(), [searchParams]);

  const requestKey = useMemo(
    () => `${searchString}|limit=${products.limit}|page=${products.page}`,
    [searchString, products.limit, products.page],
  );
  const [loadedKey, setLoadedKey] = useState<string>("");
  const isLoading = loadedKey !== requestKey;
  const filtersKeyRef = useRef(searchString);

  useEffect(() => {
    const controller = new AbortController();

    if (filtersKeyRef.current !== searchString) {
      filtersKeyRef.current = searchString;
      if (products.page !== 1) {
        setProducts((prev) => ({ ...prev, page: 1 }));
        return () => controller.abort();
      }
    }

    const qs = new URLSearchParams(searchString);
    qs.set("limit", String(products.limit));
    qs.set("page", String(products.page));

    let skipLoadedKey = false;

    getProductsByQuery(qs.toString(), controller.signal)
      .then((res) => {
        const totalPages = getTotalPages(res.total, res.limit);
        const page = clampPage(res.page ?? products.page, totalPages);
        skipLoadedKey = page !== products.page;
        setProducts({ ...res, page });
      })
      .catch((e) => {
        if (e instanceof Error && e.name === "AbortError") return;
        setError("Failed to load products");
      })
      .finally(() => {
        if (!skipLoadedKey) setLoadedKey(requestKey);
      });

    return () => controller.abort();
  }, [products.limit, products.page, searchString, requestKey]);

  const totalPages = useMemo(
    () => getTotalPages(products.total, products.limit),
    [products.total, products.limit],
  );

  const visiblePages = useMemo(() => {
    const p = products.page;
    const start = Math.max(1, p - 1);
    const end = Math.min(totalPages, p + 1);
    const windowPages: number[] = [];
    for (let i = start; i <= end; i += 1) windowPages.push(i);
    return windowPages;
  }, [products.page, totalPages]);

  const goToPage = useCallback((nextPage: number) => {
    setError(null);
    setProducts((prev) => ({
      ...prev,
      page: clampPage(nextPage, getTotalPages(prev.total, prev.limit)),
    }));
  }, []);

  const hasActiveFilters = useMemo(() => {
    if (searchParams.getAll("size").length > 0) return true;
    if (searchParams.getAll("color").length > 0) return true;
    if (searchParams.getAll("fabric").length > 0) return true;
    if (searchParams.get("collection")) return true;
    const sortby = searchParams.get("sortby");
    return Boolean(sortby && sortby !== "best_seller");
  }, [searchParams]);

  const clearFiltersHref = useMemo(() => {
    const params = new URLSearchParams(searchString);
    ["size", "color", "fabric", "collection", "sortby"].forEach((key) => {
      params.delete(key);
    });
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }, [pathname, searchString]);

  const isEmpty = !isLoading && !error && products.products.length === 0;
  const showPagination = shouldShowPagination(products.total, products.limit, {
    isLoading,
  });

  return (
    <div className={styles.productsListWrap}>
      {error ? <div className={styles.productsError}>{error}</div> : null}

      {isEmpty ? (
        <div className={styles.productsEmptyState} role="status">
          <h2 className={styles.productsEmptyTitle}>
            {hasActiveFilters
              ? "No products match your filters"
              : "No products found"}
          </h2>
          <p className={styles.productsEmptyBody}>
            {hasActiveFilters
              ? "Try adjusting or clearing your filters to see more items."
              : "Check back soon — new arrivals may be on the way."}
          </p>
          {hasActiveFilters ? (
            <p className={styles.productsEmptyBody}>
              <Link href={clearFiltersHref}>Clear all filters</Link>
            </p>
          ) : null}
        </div>
      ) : (
        <div className={styles.productsGrid} aria-busy={isLoading}>
          {isLoading
            ? Array.from({ length: products.limit }).map((_, idx) => (
                <ProductCardSkeleton key={`skeleton-${idx}`} />
              ))
            : products.products.map((product, idx) => (
                <ProductCard
                  variantId={product.default_variant_id ?? undefined}
                  key={product.slug || String(product.id)}
                  title={product.name}
                  subtitle={product.description ?? undefined}
                  price={product.base_price}
                  image={getProductCardImage(product, idx)}
                  href={
                    product.slug ? `/products/${product.slug}` : "/products"
                  }
                  colors={product.colors || []}
                  enabledColors={new Set(product.enabled_colors || [])}
                />
              ))}
        </div>
      )}

      {showPagination ? (
        <nav className={styles.pagination} aria-label="Products pagination">
          <button
            type="button"
            className={styles.pageButton}
            onClick={() => goToPage(Math.max(1, products.page - 1))}
            disabled={products.page <= 1 || isLoading}
          >
            Prev
          </button>

          <div className={styles.pageNumbers}>
            <button
              type="button"
              className={styles.pageNumber}
              onClick={() => goToPage(1)}
              aria-current={products.page === 1 ? "page" : undefined}
              disabled={isLoading}
            >
              1
            </button>

            {visiblePages[0] > 2 ? (
              <span className={styles.ellipsis}>…</span>
            ) : null}

            {visiblePages
              .filter((n) => n !== 1 && n !== totalPages)
              .map((n) => (
                <button
                  key={n}
                  type="button"
                  className={styles.pageNumber}
                  onClick={() => goToPage(n)}
                  aria-current={products.page === n ? "page" : undefined}
                  disabled={isLoading}
                >
                  {n}
                </button>
              ))}

            {visiblePages[visiblePages.length - 1] < totalPages - 1 ? (
              <span className={styles.ellipsis}>…</span>
            ) : null}

            {totalPages > 1 ? (
              <button
                type="button"
                className={styles.pageNumber}
                onClick={() => goToPage(totalPages)}
                aria-current={products.page === totalPages ? "page" : undefined}
                disabled={isLoading}
              >
                {totalPages}
              </button>
            ) : null}
          </div>

          <button
            type="button"
            className={styles.pageButton}
            onClick={() => goToPage(Math.min(totalPages, products.page + 1))}
            disabled={products.page >= totalPages || isLoading}
          >
            Next
          </button>
        </nav>
      ) : null}
    </div>
  );
}
