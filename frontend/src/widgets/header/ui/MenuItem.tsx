"use client";
import { DownIcon } from "@/shared/assets/icons";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./Header.module.scss";

interface Props {
  label: string;
  href?: string;
  children?: React.ReactNode;
}

/** Grace period before closing — survives diagonal cursor paths between
 *  trigger and dropdown, and brief mouseleaves caused by scrollbar wobble. */
const CLOSE_DELAY_MS = 120;

const MenuItem = ({ label, href = "#", children }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleEnter = () => {
    cancelClose();
    setIsActive(true);
  };

  const handleLeave = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setIsActive(false);
      closeTimerRef.current = null;
    }, CLOSE_DELAY_MS);
  };

  useEffect(() => cancelClose, []);

  return (
    <div
      className={clsx(styles.navItemWrapper, isActive && styles.active)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className={clsx(styles.navItem, isActive && styles.active)}>
        <a href={href} className={clsx(styles.navLink)}>
          {label}
        </a>
        {children && (
          <span className={styles.navItemIcon}>
            <DownIcon />
          </span>
        )}
      </div>
      {children}
    </div>
  );
};

export default MenuItem;
