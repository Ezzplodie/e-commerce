import clsx from "clsx";
import { useMemo } from "react";
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
  variant = "default",
}: AvailableColorsProps) {
  const enabledSet = useMemo(
    () =>
      enabledColors ? new Set(Array.from(enabledColors, normalizeColor)) : null,
    [enabledColors],
  );
  const normalizedSelectedColor = normalizeColor(selectedColor);
  const uniqueColors = useMemo(() => {
    const seenColors = new Set<string>();

    return colors.filter((color) => {
      const normalized = normalizeColor(color);

      if (!normalized || seenColors.has(normalized)) {
        return false;
      }

      seenColors.add(normalized);
      return true;
    });
  }, [colors]);

  return (
    <div
      className={clsx(
        styles.colorsRow,
        variant === "productDetails" && styles.productDetails,
        className,
      )}
    >
      {uniqueColors.map((color) => {
        const normalized = normalizeColor(color);
        const isEnabled = enabledSet ? enabledSet.has(normalized) : true;

        return (
          <ColorPickerButton
            key={normalized}
            color={color}
            onClick={() => onSelectColor?.(color)}
            disabled={!isEnabled}
            selected={normalizedSelectedColor === normalized}
            className={buttonClassName}
            variant={variant}
          />
        );
      })}
    </div>
  );
}
