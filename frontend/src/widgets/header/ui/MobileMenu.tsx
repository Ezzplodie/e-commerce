"use client";

import { useState } from "react";
import clsx from "clsx";
import styles from "./MobileMenu.module.scss";
import { DownIcon } from "@/shared/assets/icons";
import { getMenuByKey, getMenusByKeys } from "@/entities/navigation/selectors";
import type { MenuItemLink } from "@/entities/navigation/types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MobileMenuItemProps {
  label: string;
  href?: string;
  items?: MenuItemLink[];
  defaultExpanded?: boolean;
  onLinkClick?: () => void;
}

const MobileMenuItem = ({
  label,
  href,
  items,
 
  onLinkClick,
}: MobileMenuItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubItems = items && items.length > 0;

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <>
      <div className={styles.menuItem}>
        {href ? (
          <a href={href} className={styles.menuLink} onClick={handleLinkClick}>
            {label}
          </a>
        ) : (
          <span className={styles.menuLabel}>{label}</span>
        )}
        {hasSubItems && (
          <button
            type="button"
            className={clsx(styles.chevron, isExpanded && styles.expanded)}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? `Collapse ${label}` : `Expand ${label}`}
            aria-expanded={isExpanded}
          >
            <DownIcon />
          </button>
        )}
      </div>
      {hasSubItems && isExpanded && (
        <ul className={styles.subMenu}>
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className={styles.subMenuLink}
                onClick={handleLinkClick}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
      <div className={styles.divider} />
    </>
  );
};

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;
  const categoryMenu = getMenuByKey("category");
  const sustainabilityMenu = getMenuByKey("sustainability");
  const collectionMenus = getMenusByKeys(["category", "featured", "more"]);
  const collectionItems: MenuItemLink[] = [];
  collectionMenus.forEach((menu) => {
    collectionItems.push(...menu.items);
  });


  return (
    <div className={styles.menuWrapper}>
      <div className={styles.menu}>
        <MobileMenuItem
          label="Collection"
          items={collectionItems}
          defaultExpanded={false}
          onLinkClick={onClose}
        />
        <MobileMenuItem
          label="New In"
          items={categoryMenu?.items}
          defaultExpanded={true}
          onLinkClick={onClose}
        />
        <MobileMenuItem
          label="Modiweek"
          href="/featured/modiweek"
          onLinkClick={onClose}
        />
        <MobileMenuItem
          label="Plus Size"
          href="/featured/plus-size"
          onLinkClick={onClose}
        />
        <MobileMenuItem
          label="Sustainability"
          items={sustainabilityMenu?.items}
          defaultExpanded={true}
          onLinkClick={onClose}
        />
      </div>
    </div>
  );
};

export default MobileMenu;
