import clsx from "clsx";
import type { CSSProperties } from "react";
import { getMappedColorValue, normalizeColor } from "@/shared/lib/color";
import { ColorPickerButtonProps } from "./ColorPickerButton.types";
import styles from "./ColorPickerButton.module.scss";

export function ColorPickerButton({
  color,
  disabled = false,
  className,
  selected = false,
  variant = "default",
  onColorClick,
}: ColorPickerButtonProps) {
  const colorValue = getMappedColorValue(color);
  const buttonStyle = {
    "--color-picker-color": colorValue,
    "--color-picker-border-color":
      variant === "default" && normalizeColor(color) === "white"
        ? "var(--black)"
        : "rgba(0, 0, 0, 0.1)",
  } as CSSProperties;

  return (
    <button
      disabled={disabled}
      style={buttonStyle}
      type="button"
      onClick={(event) => onColorClick?.(color, event)}
      className={clsx(
        styles.colorButton,
        variant === "productDetails"
          ? styles.productDetailsButton
          : styles.defaultButton,
        selected &&
          (variant === "productDetails"
            ? styles.productDetailsSelected
            : styles.selected),
        className,
      )}
      aria-label={`Select color ${color}`}
      aria-pressed={selected}
    ></button>
  );
}
