"use client";

import clsx from "clsx";
import { Minus, Plus } from "lucide-react";
import { ReactNode, useState } from "react";
import styles from "./ProductAccordion.module.scss";

type Props = {
  title: string;
  defaultOpen?: boolean;
  accent?: boolean;
  children: ReactNode;
};

export function ProductAccordion({
  title,
  defaultOpen = false,
  accent = false,
  children,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={styles.accordion}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <span className={clsx(styles.title, isOpen && accent && styles.titleAccent)}>
          {title}
        </span>

        <span className={styles.icon} aria-hidden="true">
          {isOpen ? <Minus size={18} strokeWidth={1.8} /> : <Plus size={18} strokeWidth={1.8} />}
        </span>
      </button>

      {isOpen ? <div className={styles.content}>{children}</div> : null}
    </section>
  );
}
