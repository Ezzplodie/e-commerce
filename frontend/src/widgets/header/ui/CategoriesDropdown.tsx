"use client";

import clsx from "clsx";
import styles from "./CategoriesDropdown.module.scss";
import { MegaMenu } from "@/entities/navigation/types";

interface CategoriesDropdownProps {
  content: MegaMenu;
  className?: string;
}

const CategoriesDropdown = ({
  content,
  className,
}: CategoriesDropdownProps) => {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <div className="container">
        <div className={styles.column}>
          <h3 className={styles.categoryTitle}>{content.label}</h3>

          <ul className={styles.subcategoryList}>
            {content.items.map((item) => (
              <li key={item}>
                <a href="#" className={styles.subcategoryLink}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoriesDropdown;
