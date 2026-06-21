import clsx from "clsx";
import styles from "./Header.module.scss";
import Link from "next/link";

type HeaderActionItemProps = {
  icon: React.ComponentType<{ width: number; height: number }>;
  ariaLabel: string;
  variant: string;
  badgeCount?: number;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
};
export const HeaderActionItem = ({
  icon: Icon,
  ariaLabel,
  variant,
  badgeCount,
  isActive,
  href,
  onClick,
}: HeaderActionItemProps) => {
  const className = clsx(
    styles.action,
    styles[variant],
    isActive && styles.active,
  );
  const content = (
    <>
      <Icon width={24} height={24} />
      {badgeCount !== undefined && (
        <span className={styles.badge}>{badgeCount}</span>
      )}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={className} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
};
