"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { CartDrawer } from "@/features/cart";
import styles from "./Header.module.scss";
import CollectionDropdown from "./CollectionDropdown";
import { LogoIcon } from "@/shared/assets/icons";
import MenuItem from "./MenuItem";
import { HeaderActions } from "./HeaderActions";
import MobileMenu from "./MobileMenu";
import { getMenusByKeys } from "@/entities/navigation/selectors";
import { useCartStore } from "@/features/cart/model/cartStore";

const Header = () => {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const collectionMenus = getMenusByKeys(["category", "featured", "more"]);
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
          <div className={styles.headerLogo}>
            <LogoIcon width={184} height={46} className={styles.logo} />
          </div>

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
