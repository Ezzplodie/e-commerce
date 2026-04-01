import clsx from "clsx";
import type { CSSProperties } from "react";
import { normalizeColor } from "@/shared/lib/color";
import { ColorPickerButtonProps } from "./ColorPickerButton.types";
import { getMappedColorValue } from "./colorMap";
import styles from "./ColorPickerButton.module.scss";

export function ColorPickerButton({
  color,
  onClick,
  disabled = false,
  className,
  selected = false,
  variant = "default",
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
      style={buttonStyle}
      type="button"
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
      onClick={onClick}
      disabled={disabled}
      aria-label={`Select color ${color}`}
      aria-pressed={selected}
    ></button>
  );
}
