import clsx from "clsx";
import styles from "./Checkbox.module.scss";
import { CheckboxProps } from "./Checkbox.types";

export function Checkbox({
  children,
  className,
  inputClassName,
  label,
  labelClassName,
  size = "md",
  ...props
}: CheckboxProps) {
  const labelContent = children ?? label;

  return (
    <label className={clsx(styles.root, styles[size], className)}>
      <input
        className={clsx(styles.input, inputClassName)}
        type="checkbox"
        {...props}
      />
      {labelContent ? (
        <span className={clsx(styles.label, labelClassName)}>
          {labelContent}
        </span>
      ) : null}
    </label>
  );
}
