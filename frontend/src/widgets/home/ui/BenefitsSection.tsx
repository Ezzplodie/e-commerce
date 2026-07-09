import { Sparkles, Truck, RotateCcw } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import styles from "./BenefitsSection.module.scss";

const BENEFITS = [
  {
    icon: Sparkles,
    title: "Premium materials",
    body: "Soft, durable fabrics that hold their shape wear after wear.",
  },
  {
    icon: Truck,
    title: "Fast shipping",
    body: "Same‑day dispatch on most orders, delivered in 1–3 business days.",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    body: "Try it at home — return any unworn item within 14 days, free.",
  },
];

export function BenefitsSection() {
  return (
    <section className={styles.benefits} aria-label="Benefits">
      <Container>
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionKicker}>Why us</p>
            <h2 className={styles.sectionTitle}>
              Quality you can feel
            </h2>
          </div>
          <p className={styles.sectionSubtitle}>
            Thoughtful design, honest materials, and support that actually
            helps when you need it.
          </p>
        </header>

        <ul className={styles.benefitsGrid}>
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <li key={title} className={styles.benefitCard}>
              <span className={styles.benefitIcon} aria-hidden="true">
                <Icon size={22} strokeWidth={1.5} />
              </span>
              <h3 className={styles.benefitTitle}>{title}</h3>
              <p className={styles.benefitBody}>{body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
