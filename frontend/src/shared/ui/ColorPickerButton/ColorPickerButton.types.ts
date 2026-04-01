export type ColorPickerButtonVariant = "default" | "productDetails";

export type ColorPickerButtonProps = {
  color: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  className?: string;
  variant?: ColorPickerButtonVariant;
};
