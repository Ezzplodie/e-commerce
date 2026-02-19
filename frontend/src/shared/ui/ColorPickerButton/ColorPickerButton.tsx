import clsx from "clsx";
import { ColorPickerButtonProps } from "./ColorPickerButton.types";
import { getMappedColorValue } from "./colorMap";
import styles from "./ColorPickerButton.module.scss";

export function ColorPickerButton({
  color,
  onClick,
  disabled = false,
  className,
  selected = false,
}: ColorPickerButtonProps) {
  const colorValue = getMappedColorValue(color);
  return (
    <button
      style={{
        backgroundColor: colorValue,
        borderColor: color === "White" ? "var(--black)" : "transparent",
      }}
      type="button"
      className={clsx(
        styles.color_button,
        selected && styles.selected,
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Select color ${color}`}
      aria-pressed={selected}
    ></button>
  );
}
