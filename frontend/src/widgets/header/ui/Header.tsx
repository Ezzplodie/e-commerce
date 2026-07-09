"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { CartDrawer } from "@/features/cart";
import styles from "./Header.module.scss";
import CollectionDropdown from "./CollectionDropdown";
import { LogoIcon } from "@/shared/assets/icons";
import MenuItem from "./MenuItem";
import { HeaderActions } from "./HeaderActions";
import MobileMenu from "./MobileMenu";
import { getMenusByKeys } from "@/entities/navigation";
import { useCartStore } from "@/features/cart";
import Link from "next/link";
import type { Category } from "@/entities/category";
import { getCategories } from "@/entities/category";
import { useWishListStore } from "@/features/wish-list/model/wishListStore";
const Header = () => {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    getCategories(controller.signal)
      .then((res) => setCategories(res))
      .catch(() => setCategories([]));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const { isLoaded, isLoading, load } = useWishListStore.getState();
    if (!isLoaded && !isLoading) {
      void load();
    }
  }, []);

  const collectionMenus = useMemo(() => {
    const menus = getMenusByKeys(["category", "featured", "more"]);
    if (!categories.length) return menus;

    return menus.map((m) => {
      if (m.key !== "category") return m;

      return {
        ...m,
        items: [
          { id: "all", label: "Shop all", href: "/categories" },
          ...categories.map((c) => ({
            id: c.slug,
            label: c.name,
            href: `/categories/${c.slug}`,
          })),
        ],
      };
    });
  }, [categories]);
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cartItemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const handleCloseCart = () => {
    closeCart();
  };

  const handleCheckout = () => {
    closeCart();
    router.push("/cart");
  };

  return (
    <>
      <div className={styles.info}>Enjoy Free Shipping On All Orders</div>
      <header className={styles.header}>
        <div className={clsx(styles.headerInner, "container")}>
          <Link href="/" className={styles.headerLogo}>
            <LogoIcon width={184} height={46} className={styles.logo} />
          </Link>

          <nav className={styles.nav}>
            <MenuItem label="Collection" href="/test">
              <CollectionDropdown content={collectionMenus} />
            </MenuItem>

            <MenuItem label="New In"></MenuItem>

            <MenuItem label="Modiweek"></MenuItem>

            <MenuItem label="Plus Size"></MenuItem>

            <MenuItem label="Sustainability" />
          </nav>

          <HeaderActions
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            onCartClick={() => openCart()}
            cartItemCount={cartItemCount}
          ></HeaderActions>
        </div>
      </header>
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <CartDrawer
        isOpen={isOpen}
        items={items}
        onClose={handleCloseCart}
        onRemoveItem={(item) => removeItem(item.id)}
        onQuantityChange={(item, quantity) => updateQuantity(item.id, quantity)}
        onCheckout={handleCheckout}
      />
    </>
  );
};

export default Header;
