import { Truck, RotateCcw, ShieldCheck, Leaf } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import styles from "./HomePage.module.scss";

const ITEMS = [
  {
    icon: Truck,
    title: "Free shipping",
    body: "On orders over $80",
  },
  {
    icon: RotateCcw,
    title: "14-day returns",
    body: "Hassle-free exchanges",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    body: "Encrypted payments",
  },
  {
    icon: Leaf,
    title: "Mindfully made",
    body: "Responsible materials",
  },
];

export function TrustStrip() {
  return (
    <section className={styles.trust} aria-label="Why shop with us">
      <Container as="ul" innerClassName={styles.trustInner}>
        {ITEMS.map(({ icon: Icon, title, body }) => (
          <li key={title} className={styles.trustItem}>
            <span className={styles.trustIcon} aria-hidden="true">
              <Icon size={20} strokeWidth={1.6} />
            </span>
            <div className={styles.trustText}>
              <span className={styles.trustTitle}>{title}</span>
              <span className={styles.trustBody}>{body}</span>
            </div>
          </li>
        ))}
      </Container>
    </section>
  );
}
