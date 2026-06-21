import type { Dispatch, SetStateAction } from "react";
import {
  CloseIcon,
  BagIcon,
  FavoriteIcon,
  ProfileIcon,
  SearchIcon,
  MenuIcon,
  MenuCloseIcon,
} from "@/shared/assets/icons";

import styles from "./Header.module.scss";
import { HeaderActionItem } from "./HeaderActionItem";

interface HeaderActionsProps {
  isSearchOpen: boolean;
  setIsSearchOpen: Dispatch<SetStateAction<boolean>>;
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  onCartClick: () => void;
  cartItemCount: number;
}
export const HeaderActions = (props: HeaderActionsProps) => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    isMenuOpen,
    setIsMenuOpen,
    onCartClick,
    cartItemCount,
  } = props;

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
      icon: FavoriteIcon,
      ariaLabel: "Favorites",
      variant: "favorites",
      link: "/favorites",
    },
    {
      id: "bag",
      icon: BagIcon,
      onClick: onCartClick,
      ariaLabel: "Cart",
      variant: "cart",
      badgeCount: cartItemCount > 0 ? cartItemCount : undefined,
    },
    {
      id: "menu",
      icon: isMenuOpen ? MenuCloseIcon : MenuIcon,
      onClick: () => setIsMenuOpen((v) => !v),
      ariaLabel: isMenuOpen ? "Close menu" : "Open menu",
      variant: "menu",
    },
  ];

  return (
    <div className={styles.actions}>
      {actions.map(
        ({ id, icon: Icon, onClick, ariaLabel, variant, badgeCount, link }) => (
          <HeaderActionItem
            key={id}
            icon={Icon}
            ariaLabel={ariaLabel}
            variant={variant}
            badgeCount={badgeCount}
            isActive={variant === "menu" && isMenuOpen}
            {...(link ? { href: link } : { onClick: onClick as () => void })}
          />
        ),
      )}
    </div>
  );
};
