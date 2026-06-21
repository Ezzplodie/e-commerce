"use client";

// 'use client' is set in advance so you can wire up:
//   - useEffect(() => load(), [load])
//   - useWishListStore selectors
// without flipping the directive later.

import Header from "@/widgets/header";
import Footer from "@/widgets/footer";
import styles from "./FavoritesPage.module.scss";
import { useEffect } from "react";
import { useWishListStore } from "@/features/wish-list/model/wishListStore";
const { load, items, isLoading, error } = useWishListStore.getState();

export function FavoritesPage() {
  console.log(load);
  console.log(items);
  // TODO: pull state + actions from the wish-list feature store, e.g.:
  //   const items = useWishListStore((s) => s.items);
  //   const isLoading = useWishListStore((s) => s.isLoading);
  //   const error = useWishListStore((s) => s.error);
  //   const load = useWishListStore((s) => s.load);
  //
  // TODO: load on mount:
  //   useEffect(() => { load(); }, [load]);
  // useEffect(() => {
  //   load();
  // }, [load]);

  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className="container">
          <h1 className={styles.title}>Favorites</h1>

          {/* TODO (loading state):
              {isLoading && (
                <div className={styles.state} role="status">Loading...</div>
              )}
          */}

          {/* TODO (error state):
              {error && !isLoading && (
                <div className={styles.state} role="alert">{error}</div>
              )}
          */}

          {/* Empty state — render only when not loading and items.length === 0 */}
          <div className={styles.emptyState} role="status">
            <h2 className={styles.emptyTitle}>No favorites yet</h2>
            <p className={styles.emptyBody}>
              Items you mark as favorite will appear here.
            </p>
          </div>

          {/* TODO (list state):
              {!isLoading && items.length > 0 && (
                <ul className={styles.grid}>
                  {items.map((item) => (
                    <li key={item.wish_list_id}>
                      <ProductCard
                        title={item.product_name}
                        price={item.price}
                        image={item.image_url ?? ""}
                        href={`/products/${item.product_slug}`}
                      />
                    </li>
                  ))}
                </ul>
              )}
          */}
        </div>
      </main>
      <Footer />
    </>
  );
}
