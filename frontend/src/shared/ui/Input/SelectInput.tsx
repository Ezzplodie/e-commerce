import clsx from "clsx";
import styles from "./SelectInput.module.scss";
import { SelectInputProps } from "./SelectInput.types";

export function SelectInput({
  className,
  name = "",
  children,
  ...props
}: SelectInputProps) {
  return (
    <select className={clsx(styles.select, className)} {...props} name={name}>
      {children}
    </select>
  );
}
