export type TextInputProps = {
  className?: string;
  iconClassName?: string;
  name?: string;
  inputClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;
