export type ColorPickerButtonVariant = "default" | "productDetails";

export type ColorPickerButtonProps = {
  color: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  className?: string;
  variant?: ColorPickerButtonVariant;
  href?: string;
  onColorClick?: (
    color: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
};
