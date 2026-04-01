import type { ColorPickerButtonVariant } from "@/shared/ui/ColorPickerButton";

export type AvailableColorsProps = {
  colors: string[];
  selectedColor?: string;
  enabledColors?: Iterable<string>;
  onSelectColor?: (color: string) => void;
  className?: string;
  buttonClassName?: string;
  variant?: ColorPickerButtonVariant;
};
