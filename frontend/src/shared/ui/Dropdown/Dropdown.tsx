"use client";

import { ReactNode } from "react";
import clsx from "clsx";
import styles from "./Dropdown.module.scss";

interface Props {
  children: ReactNode;
  className?: string;
}

const Dropdown = ({ children, className }: Props) => {
  return (
    <div className={styles.dropdownWrapper}>
      <div className={clsx(styles.dropdown, className)}>
        <div className={clsx(styles.container, "container")}>{children}</div>
      </div>
    </div>
  );
};

export default Dropdown;
