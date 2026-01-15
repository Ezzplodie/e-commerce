"use client";
import { useState } from "react";
import clsx from "clsx";
import styles from "./Header.module.scss";
import CategoriesDropdown from "./CategoriesDropdown";

import Logo from "@/shared/icons/logo.svg";
import CloseIcon from "@/shared/icons/close.svg";
import BagIcon from "@/shared/icons/bag.svg";
import FavIcon from "@/shared/icons/favorite.svg";
import ProfileIcon from "@/shared/icons/profile.svg";
import SearchIcon from "@/shared/icons/search.svg";
import MenuIcon from "@/shared/icons/menu.svg";
import CloseMenuIcon from "@/shared/icons/menu_close.svg";
import MenuItem from "./MenuItem";
import { megaMenus } from "@/entities/navigation/megaMenus";
import { getMegaMenuByKey } from "@/entities/navigation/selectors";
const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const actions = [
    {
      id: "search",
      icon: isSearchOpen ? CloseIcon : SearchIcon,
      onClick: () => setIsSearchOpen((v) => !v),
      ariaLabel: isSearchOpen ? "Close search" : "Open search",
      variant: "search",
    },
    {
      id: "profile",
      icon: ProfileIcon,
      ariaLabel: "Profile",
      variant: "profile",
    },
    {
      id: "favorite",
      icon: FavIcon,
      ariaLabel: "Favorites",
      variant: "favorites",
    },
    {
      id: "bag",
      icon: BagIcon,
      ariaLabel: "Cart",
      variant: "cart",
    },
    {
      id: "menu",
      icon: isMenuOpen ? CloseMenuIcon : MenuIcon,
      onClick: () => setIsMenuOpen((v) => !v),
      ariaLabel: isMenuOpen ? "Close menu" : "Open menu",
      variant: "menu",
    },
  ];
  const categoryMenu = getMegaMenuByKey(megaMenus, "category");
  return (
    <>
      <div className={styles.info}>Enjoy Free Shipping On All Orders</div>
      <header className={styles.header}>
        <div className={clsx(styles.headerInner, "container")}>
          <div className={styles.headerLogo}>
            <Logo width={184} height={46} className={styles.logo} />
          </div>

          <nav className={styles.nav}>
            <MenuItem label="Collection">
              <CategoriesDropdown content={categoryMenu} />
            </MenuItem>

            <MenuItem label="New In">
              <h2>test</h2>
            </MenuItem>

            <MenuItem label="Modiweek">
              <h2>test</h2>{" "}
            </MenuItem>

            <MenuItem label="Plus Size">
              <h2>test</h2>{" "}
            </MenuItem>

            <MenuItem label="Sustainability" />
          </nav>

          <div className={styles.actions}>
            {actions.map(({ id, icon: Icon, onClick, ariaLabel, variant }) => (
              <button
                key={id}
                type="button"
                className={clsx(
                  styles.action,
                  styles[variant],
                  // FIX: Use styles.active here too
                  variant === "menu" && isMenuOpen && styles.active
                )}
                onClick={onClick}
                aria-label={ariaLabel}
              >
                <Icon width={24} height={24} />
              </button>
            ))}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
