import clsx from "clsx";
import styles from "./SelectInput.module.scss";
import { SelectInputProps } from "./SelectInput.types";

export function SelectInput({
  className,
  children,
  ...props
}: SelectInputProps) {
  return (
    <select className={clsx(styles.select, className)} {...props}>
      {children}
    </select>
  );
}
