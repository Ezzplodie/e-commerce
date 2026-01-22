"use client";
import { DownIcon } from "@/shared/assets/icons";
import { useState } from "react";
import clsx from "clsx";
import styles from "./Header.module.scss";

interface Props {
  label: string;
  href?: string;
  children?: React.ReactNode;
}

const MenuItem = ({ label, href = "#", children }: Props) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className={clsx(styles.navItemWrapper, isActive && styles.active)}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <div className={clsx(styles.navItem, isActive && styles.active)}>
        <a href={href} className={clsx(styles.navLink)}>
          {label}
        </a>
        {children && (
          <span className={styles.navItemIcon}>
            <DownIcon></DownIcon>
          </span>
        )}
      </div>
      {children}
    </div>
  );
};

export default MenuItem;
