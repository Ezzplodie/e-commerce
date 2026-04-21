export type CheckboxSize = "md" | "sm";

export type CheckboxProps = {
  children?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  label?: React.ReactNode;
  size?: CheckboxSize;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">;
