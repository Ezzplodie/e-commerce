"use client";
import styles from "./ProductsPage.module.scss";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductsListResponse } from "@/entities/product/types";
import { getProductsByQuery } from "@/entities/product/api";
import { ProductCard, ProductCardSkeleton } from "@/shared/ui/ProductCard";
import { getProductCardImage } from "@/entities/product";
export function ProductsList() {
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

  useEffect(() => {
    const controller = new AbortController();
    const qs = new URLSearchParams(searchString);
    qs.set("limit", String(products.limit));
    qs.set("page", String(products.page));

    getProductsByQuery(qs.toString(), controller.signal)
      .then((res) => setProducts(res))
      .catch((e) => {
        if (e instanceof Error && e.name === "AbortError") return;
        setError("Failed to load products");
      })
      .finally(() => setLoadedKey(requestKey));

    return () => controller.abort();
  }, [products.limit, products.page, searchString, requestKey]);

  const totalPages = Math.max(1, Math.ceil(products.total / products.limit));

  const visiblePages = (() => {
    const p = products.page;
    const start = Math.max(1, p - 1);
    const end = Math.min(totalPages, p + 1);
    const windowPages = [];
    for (let i = start; i <= end; i += 1) windowPages.push(i);
    return windowPages;
  })();

  const goToPage = (nextPage: number) => {
    setError(null);
    setProducts((prev) => ({ ...prev, page: nextPage }));
  };

  return (
    <div className={styles.productsListWrap}>
      {error ? <div className={styles.productsError}>{error}</div> : null}
      <div className={styles.productsGrid} aria-busy={isLoading}>
        {isLoading
          ? Array.from({ length: products.limit }).map((_, idx) => (
              <ProductCardSkeleton key={`skeleton-${idx}`} />
            ))
          : products.products.map((product, idx) => (
              <ProductCard
                key={product.slug || String(product.id)}
                title={product.name}
                subtitle={product.description ?? undefined}
                price={product.base_price}
                image={getProductCardImage(product, idx)}
                href={product.slug ? `/products/${product.slug}` : "/products"}
                colors={product.colors || []}
                enabledColors={new Set(product.enabled_colors || [])}
              />
            ))}
      </div>

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
    </div>
  );
}
