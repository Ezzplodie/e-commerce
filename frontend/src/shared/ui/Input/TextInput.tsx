import clsx from "clsx";
import styles from "./TextInput.module.scss";
import { TextInputProps } from "./TextInput.types";

export function TextInput({
  className,
  iconClassName,
  inputClassName,
  leftIcon,
  rightIcon,
  name = "",
  type = "text",
  wrapperClassName,
  ...props
}: TextInputProps) {
  const hasIcon = Boolean(leftIcon || rightIcon);
  const input = (
    <input
      className={clsx(
        styles.input,
        hasIcon && styles.inputWithIcon,
        className,
        inputClassName,
      )}
      type={type}
      name={name}
      {...props}
    />
  );

  if (!hasIcon) {
    return input;
  }

  return (
    <span className={clsx(styles.wrapper, wrapperClassName)}>
      {leftIcon ? (
        <span className={clsx(styles.icon, styles.leftIcon, iconClassName)}>
          {leftIcon}
        </span>
      ) : null}
      {input}
      {rightIcon ? (
        <span className={clsx(styles.icon, styles.rightIcon, iconClassName)}>
          {rightIcon}
        </span>
      ) : null}
    </span>
  );
}
