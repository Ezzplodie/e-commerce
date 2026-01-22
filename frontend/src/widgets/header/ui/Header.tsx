"use client";
import { useState } from "react";
import clsx from "clsx";
import styles from "./Header.module.scss";
import CollectionDropdown from "./CollectionDropdown";
import { LogoIcon } from "@/shared/assets/icons";
import MenuItem from "./MenuItem";
import { HeaderActions } from "./HeaderActions";
import MobileMenu from "./MobileMenu";
import { getMenusByKeys } from "@/entities/navigation/selectors";
const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const collectionMenus = getMenusByKeys(["category", "featured", "more"]);

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
          ></HeaderActions>
        </div>
      </header>
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Header;
