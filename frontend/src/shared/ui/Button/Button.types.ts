import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";

export type ButtonVariant = "primary" | "secondary" | "icon";

type ButtonOwnProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

export type ButtonProps<T extends ElementType = "button"> = ButtonOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>;
