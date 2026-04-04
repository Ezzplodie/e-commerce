import {
  CloseIcon,
  BagIcon,
  FavoriteIcon,
  ProfileIcon,
  SearchIcon,
  MenuIcon,
  MenuCloseIcon,
} from "@/shared/assets/icons";

import clsx from "clsx";
import styles from "./Header.module.scss";

interface HeaderActionsProps {
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
        ({ id, icon: Icon, onClick, ariaLabel, variant, badgeCount }) => (
          <button
            key={id}
            type="button"
            className={clsx(
              styles.action,
              styles[variant],
              variant === "menu" && isMenuOpen && styles.active,
            )}
            onClick={onClick}
            aria-label={ariaLabel}
          >
            <Icon width={24} height={24} />
            {badgeCount !== undefined && (
              <span className={styles.badge}>{badgeCount}</span>
            )}
          </button>
        ),
      )}
    </div>
  );
};
