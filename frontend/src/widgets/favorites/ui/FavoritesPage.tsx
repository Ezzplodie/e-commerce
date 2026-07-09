"use client";

// 'use client' is set in advance so you can wire up:
//   - useEffect(() => load(), [load])
//   - useWishListStore selectors
// without flipping the directive later.
import { useEffect } from "react";
import Header from "@/widgets/header";
import Footer from "@/widgets/footer";
import { Container } from "@/shared/ui/Container";
import styles from "./FavoritesPage.module.scss";

import {
  AddToWishListButton,
  useWishListStore,
} from "@/features/wish-list";
import { ProductsGrid, ProductGridItem } from "@/shared/ui/ProductGrid";
import { mapWishListItemToCard } from "@/features/wish-list/lib/mapWishListItemToCard";

export function FavoritesPage() {
  // TODO: pull state + actions from the wish-list feature store, e.g.:

  const items = useWishListStore((s) => s.items);
  const isLoading = useWishListStore((s) => s.isLoading);
  const isLoaded = useWishListStore((s) => s.isLoaded);
  const error = useWishListStore((s) => s.error);
  const load = useWishListStore((s) => s.load);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <Header />
      <main className={styles.page}>
        <Container>
          <h1 className={styles.title}>Favorites</h1>
          {(!isLoaded || isLoading) && (
            <ProductsGrid isLoading skeletonCount={4} items={[]} columns={4} />
          )}

          {isLoaded && !isLoading && items.length === 0 && (
            <div className={styles.emptyState} role="status">
              <h2 className={styles.emptyTitle}>No favorites yet</h2>
              <p className={styles.emptyBody}>
                Items you mark as favorite will appear here.
              </p>
            </div>
          )}

          {isLoaded && items.length > 0 && (
            <ProductsGrid
              columns={4}
              items={items.map((item) => {
                const card = mapWishListItemToCard(item);

                return {
                  ...card,
                  imageAction: (
                    <AddToWishListButton
                      title={card.title}
                      variantId={card.variantId!}
                    />
                  ),
                } as ProductGridItem;
              })}
              isLoading={isLoading}
              skeletonCount={items.length}
            />
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
