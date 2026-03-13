import clsx from "clsx";
import styles from "./Button.module.scss";
import { ButtonProps } from "./Button.types";

export function Button({
  className,
  type = "button",
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(styles.button, styles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
