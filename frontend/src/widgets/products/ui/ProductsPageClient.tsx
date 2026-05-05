"use client";

import { useEffect, useMemo, useState } from "react";
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

export function ProductsPageClient() {
  const searchParams = useSearchParams();
  const searchString = useMemo(() => searchParams.toString(), [searchParams]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [facets, setFacets] = useState<FacetsState>({
    color: [],
    size: [],
    fabric: [],
  });
  const [loadedKey, setLoadedKey] = useState<string>("");

  const isLoading = loadedKey !== searchString;

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

  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={`${styles.container} container`}>
          <aside className={styles.filters}>
            <ProductFilters
              colors={facets.color}
              sizes={facets.size}
              fabric={facets.fabric}
              isFacetsLoading={isLoading}
            />
          </aside>

          <section className={styles.content} aria-label="Products">
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

            <ProductsList />
          </section>
        </div>

        {isFiltersOpen ? (
          <div
            className={styles.filtersModalOverlay}
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            onClick={() => setIsFiltersOpen(false)}
          >
            <div
              className={styles.filtersModal}
              onClick={(e) => e.stopPropagation()}
            >
              <ProductFilters
                colors={facets.color}
                sizes={facets.size}
                fabric={facets.fabric}
                isFacetsLoading={isLoading}
                onClose={() => setIsFiltersOpen(false)}
              />
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  );
}

