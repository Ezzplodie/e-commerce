"use client";
import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { normalizeColor } from "@/shared/lib/color";
import { ColorPickerButton } from "@/shared/ui/ColorPickerButton";
import { AvailableColorsProps } from "./AvailableColors.types";
import styles from "./AvailableColors.module.scss";
import { useRouter } from "next/navigation";

export function AvailableColors({
  colors,
  selectedColor,
  enabledColors,
  onSelectColor,
  className,
  href,
  buttonClassName,
  variant = "default",
}: AvailableColorsProps) {
  const router = useRouter();
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

  const handleColorClick = useCallback(
    (color: string, event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (onSelectColor) {
        onSelectColor(color);
        return;
      }
      if (href) {
        router.push(`${href}?color=${normalizeColor(color)}`);
      }
    },
    [href, onSelectColor, router],
  );

  return (
    <div
      className={clsx(
        styles.colorsRow,
        variant === "productDetails" && styles.productDetails,
        className,
      )}
    >
      {uniqueColors.map((color) => {
        const normalizedColor = normalizeColor(color);
        const isEnabled = enabledSet ? enabledSet.has(normalizedColor) : true;

        return (
          <ColorPickerButton
            key={normalizedColor}
            color={color}
            onColorClick={handleColorClick}
            disabled={!isEnabled}
            selected={normalizedSelectedColor === normalizedColor}
            className={buttonClassName}
            variant={variant}
          />
        );
      })}
    </div>
  );
}
