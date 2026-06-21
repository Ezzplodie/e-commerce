"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./ProductsPage.module.scss";
import { ProductFilters } from "@/widgets/product-filters";
import { ProductsList } from "./ProductsList";
import { getFilterFacets } from "@/entities/product/api";
import type { FilterFacetItem } from "@/entities/product/types";
import Header from "@/widgets/header";
import Footer from "@/widgets/footer";
import { Button } from "@/shared/ui/Button";

type FacetsState = {
  color: FilterFacetItem[];
  size: FilterFacetItem[];
  fabric: FilterFacetItem[];
};

type ProductsPageClientProps = {
  showHeaderFooter?: boolean;
  topSlot?: ReactNode;
};

export function ProductsPageClient({
  showHeaderFooter = true,
  topSlot,
}: ProductsPageClientProps) {
  const searchParams = useSearchParams();
  const searchString = useMemo(() => searchParams.toString(), [searchParams]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [facets, setFacets] = useState<FacetsState>({
    color: [],
    size: [],
    fabric: [],
  });
  const [loadedKey, setLoadedKey] = useState<string>("");

  const isFacetsLoading = loadedKey !== searchString;

  const hasActiveFilters = useMemo(() => {
    const params = new URLSearchParams(searchString);
    if (params.getAll("size").length > 0) return true;
    if (params.getAll("color").length > 0) return true;
    if (params.getAll("fabric").length > 0) return true;
    if (params.get("collection")) return true;
    const sortby = params.get("sortby");
    return Boolean(sortby && sortby !== "best_seller");
  }, [searchString]);

  const hasFacetOptions = useMemo(() => {
    const hasCount = (items: FilterFacetItem[]) => items.some((item) => item.count > 0);
    return (
      hasCount(facets.color) || hasCount(facets.size) || hasCount(facets.fabric)
    );
  }, [facets]);

  const showFilters = hasFacetOptions || hasActiveFilters;

  useEffect(() => {
    const controller = new AbortController();

    getFilterFacets(searchString, controller.signal)
      .then((res) => {
        setFacets(res.facets);
        setLoadedKey(searchString);
      })
      .catch(() => {
        // keep previous facets on error
        setLoadedKey(searchString);
      });

    return () => controller.abort();
  }, [searchString]);

  const content = (
    <main className={styles.page}>
      {topSlot}
      <div
        className={`${styles.container} container${showFilters ? "" : ` ${styles.containerNoFilters}`}`}
      >
        {showFilters ? (
          <aside className={styles.filters}>
            <ProductFilters
              colors={facets.color}
              sizes={facets.size}
              fabric={facets.fabric}
              isFacetsLoading={isFacetsLoading}
            />
          </aside>
        ) : null}

        <section className={styles.content} aria-label="Products">
          {showFilters ? (
            <div className={styles.mobileFiltersBar}>
              <Button
                type="button"
                variant="secondary"
                className={styles.mobileFiltersButton}
                onClick={() => setIsFiltersOpen(true)}
              >
                Filters
              </Button>
            </div>
          ) : null}

          <ProductsList />
        </section>
      </div>

      {showFilters && isFiltersOpen ? (
        <div
          className={styles.filtersModalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          onClick={() => setIsFiltersOpen(false)}
        >
          <div className={styles.filtersModal} onClick={(e) => e.stopPropagation()}>
            <ProductFilters
              colors={facets.color}
              sizes={facets.size}
              fabric={facets.fabric}
              isFacetsLoading={isFacetsLoading}
              onClose={() => setIsFiltersOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </main>
  );

  return (
    <>
      {showHeaderFooter ? <Header /> : null}
      {content}
      {showHeaderFooter ? <Footer /> : null}
    </>
  );
}

