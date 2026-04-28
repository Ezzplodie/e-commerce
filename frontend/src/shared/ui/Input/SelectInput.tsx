import clsx from "clsx";
import styles from "./SelectInput.module.scss";
import { SelectInputProps } from "./SelectInput.types";

export function SelectInput({
  className,
  name = "",
  children,
  ...props
}: SelectInputProps) {
  const { value, defaultValue, ...restProps } = props;

  return (
    <select
      className={clsx(styles.select, className)}
      {...restProps}
      name={name}
      {...(value !== undefined ? { value } : { defaultValue })}
    >
      {children}
    </select>
  );
}
