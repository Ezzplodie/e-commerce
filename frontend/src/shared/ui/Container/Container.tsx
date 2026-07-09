import type {
  CSSProperties,
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";
import clsx from "clsx";
import styles from "./Container.module.scss";

export type ContainerSize = "default" | "narrow" | "wide";

type ContainerOwnProps<T extends ElementType> = {
  /**
   * Element to render for the inner (max-width) wrapper.
   * The outer (side-padding) wrapper is always a `<div>`.
   * @default "div"
   */
  as?: T;
  /**
   * Inner max-width preset.
   * - "default" → 1320px (most pages)
   * - "narrow"  → 900px (prose / FAQ / legal)
   * - "wide"    → 1480px (full grids)
   * @default "default"
   */
  size?: ContainerSize;
  /** Classes for the outer (side-padding) wrapper. */
  className?: string;
  /** Inline styles for the outer (side-padding) wrapper. */
  outerStyle?: CSSProperties;
  /** Classes for the inner (max-width centered) wrapper. */
  innerClassName?: string;
  children?: ReactNode;
};

export type ContainerProps<T extends ElementType = "div"> =
  ContainerOwnProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof ContainerOwnProps<T>>;

export function Container<T extends ElementType = "div">({
  as,
  size = "default",
  className,
  outerStyle,
  innerClassName,
  children,
  ...rest
}: ContainerProps<T>) {
  const Inner = (as || "div") as ElementType;

  return (
    <div className={clsx(styles.outer, className)} style={outerStyle}>
      <Inner
        className={clsx(
          styles.inner,
          size === "narrow" && styles.narrow,
          size === "wide" && styles.wide,
          innerClassName,
        )}
        {...rest}
      >
        {children}
      </Inner>
    </div>
  );
}
