import clsx from "clsx";
import styles from "./TextInput.module.scss";
import { TextInputProps } from "./TextInput.types";

export function TextInput({
  className,
  type = "text",
  ...props
}: TextInputProps) {
  return (
    <input className={clsx(styles.input, className)} type={type} {...props} />
  );
}
