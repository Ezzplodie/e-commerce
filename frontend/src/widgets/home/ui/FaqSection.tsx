"use client";

import { useId, useRef, useState } from "react";
import styles from "./HomePage.module.scss";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How long does shipping take?",
    answer: "Usually 1–3 business days (depending on your region).",
  },
  {
    question: "Can I return an item?",
    answer:
      "Yes. Returns are accepted within 14 days if the item is unworn and in original condition.",
  },
  {
    question: "Do you restock sold out sizes?",
    answer:
      "Most best sellers restock regularly — check back or join the newsletter.",
  },
];

function FaqAccordionItem({ item }: { item: FaqItem }) {
  const contentId = useId();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;

    const measure = () => contentEl.scrollHeight;

    if (reduceMotion) {
      if (isOpen) {
        contentEl.style.maxHeight = "0px";
        contentEl.style.opacity = "0";
        contentEl.style.transform = "translateY(-2px)";
        setIsOpen(false);
      } else {
        setIsOpen(true);
        const h = measure();
        contentEl.style.maxHeight = `${h}px`;
        contentEl.style.opacity = "1";
        contentEl.style.transform = "translateY(0)";
      }
      return;
    }

    if (isOpen) {
      const startH = contentEl.getBoundingClientRect().height;
      contentEl.style.maxHeight = `${startH}px`;
      // Force reflow so browser commits start height.
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      contentEl.offsetHeight;
      contentEl.style.maxHeight = "0px";
      contentEl.style.opacity = "0";
      contentEl.style.transform = "translateY(-2px)";

      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName !== "max-height") return;
        contentEl.removeEventListener("transitionend", onEnd);
        setIsOpen(false);
      };
      contentEl.addEventListener("transitionend", onEnd);
    } else {
      setIsOpen(true);
      requestAnimationFrame(() => {
        const h = measure();
        contentEl.style.maxHeight = `${h}px`;
        contentEl.style.opacity = "1";
        contentEl.style.transform = "translateY(0)";
      });
    }
  };

  return (
    <details
      className={styles.faqItem}
      open={isOpen}
      data-open={isOpen ? "true" : "false"}
    >
      <summary
        className={styles.faqSummary}
        aria-controls={contentId}
        aria-expanded={isOpen}
        onClick={(e) => {
          e.preventDefault();
          toggle();
        }}
      >
        <span>{item.question}</span>
        <span className={styles.faqIcon} aria-hidden="true" />
      </summary>

      <div
        id={contentId}
        ref={contentRef}
        className={styles.faqContent}
        role="region"
        aria-hidden={!isOpen}
        style={{
          maxHeight: isOpen ? undefined : "0px",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(-2px)",
        }}
      >
        <div className={styles.faqContentInner}>
          <div className={styles.faqBody}>{item.answer}</div>
        </div>
      </div>
    </details>
  );
}

export function FaqSection() {
  return (
    <section className={styles.faq} aria-label="FAQ">
      <div
        className={`${styles.sectionInner} ${styles.sectionInnerNarrow} container`}
      >
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>FAQ</h2>
          <p className={styles.sectionSubtitle}>
            Quick answers to the most common questions.
          </p>
        </div>

        <div className={styles.faqList}>
          {FAQ_ITEMS.map((item) => (
            <FaqAccordionItem key={item.question} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
