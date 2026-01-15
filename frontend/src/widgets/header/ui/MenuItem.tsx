"use client";

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
      <a href={href} className={styles.navItem}>
        <span>{label}</span>
      </a>

      {isActive && children}
    </div>
  );
};

export default MenuItem;
