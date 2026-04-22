import { BreadcrumbsProps } from "./Breadcrumbs.types";
import styles from "./Breadcrumbs.module.scss";
export function Breadcrumbs({
  className,
  items,
  ariaLabel = "Breadcrumbs",
}: BreadcrumbsProps) {
  return (
    <nav className={className} aria-label={ariaLabel}>
      <ul className={styles.breadcrumbs_list}>
        {items.map((item, index) => (
          <li key={index} className={styles.breadcrumbs_item}>
            {item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
