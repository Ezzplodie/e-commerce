import clsx from "clsx";
import styles from "./TextInput.module.scss";
import { TextInputProps } from "./TextInput.types";

export function TextInput({
  placeholder,
  value,
  onChange,
  type = "text",
  className,
}: TextInputProps) {
  return (
    <input
      className={clsx(styles.input, className)}
      placeholder={placeholder}
      value={value}
      type={type}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
