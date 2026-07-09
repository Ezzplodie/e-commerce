import clsx from "clsx";
import styles from "./Button.module.scss";
import type { ElementType } from "react";
import { ButtonProps } from "./Button.types";

export function Button<T extends ElementType = "button">({
  as,
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps<T>) {
  const Component = (as || "button") as ElementType;

  return (
    <Component className={clsx(styles.button, styles[variant], className)} {...props}>
      {children}
    </Component>
  );
}
