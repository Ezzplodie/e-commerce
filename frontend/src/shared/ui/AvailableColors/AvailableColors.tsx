import clsx from "clsx";
import { normalizeColor } from "@/shared/lib/color";
import { ColorPickerButton } from "@/shared/ui/ColorPickerButton";
import { AvailableColorsProps } from "./AvailableColors.types";
import styles from "./AvailableColors.module.scss";

export function AvailableColors({
  colors,
  selectedColor,
  enabledColors,
  onSelectColor,
  className,
  buttonClassName,
}: AvailableColorsProps) {
  const enabledSet = enabledColors
    ? new Set(Array.from(enabledColors, normalizeColor))
    : null;

  return (
    <div className={clsx(styles.colors_row, className)}>
      {colors.map((color) => {
        const isEnabled = enabledSet
          ? enabledSet.has(normalizeColor(color))
          : true;

        return (
          <ColorPickerButton
            key={color}
            color={color}
            onClick={() => onSelectColor?.(color)}
            disabled={!isEnabled}
            selected={selectedColor === color}
            className={buttonClassName}
          />
        );
      })}
    </div>
  );
}
