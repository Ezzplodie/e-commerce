import clsx from "clsx";
import styles from "./Loading.module.scss";

interface LoadingProps {
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function Loading({
  className,
  label = "Loading",
  size = "md",
}: LoadingProps) {
  return (
    <div
      className={clsx(styles.loading, styles[size], className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className={styles.spinner} />
      <span className={styles.srOnly}>{label}</span>
    </div>
  );
}

export type { LoadingProps };
