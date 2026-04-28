import styles from "./HomePage.module.scss";

const BENEFITS = [
  {
    title: "Premium materials",
    body: "Soft, durable fabrics that keep their shape.",
  },
  {
    title: "Fast shipping",
    body: "Same‑day dispatch on most orders.",
  },
  {
    title: "Easy returns",
    body: "Try it at home — return within 14 days.",
  },
];

export function BenefitsSection() {
  return (
    <section className={styles.benefits} aria-label="Benefits">
      <div className={`${styles.sectionInner} container`}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why customers keep coming back</h2>
          <p className={styles.sectionSubtitle}>
            Thoughtful design, honest quality, and support that actually helps.
          </p>
        </header>

        <div className={styles.benefitsGrid}>
          {BENEFITS.map((b) => (
            <div key={b.title} className={styles.benefitCard}>
              <div className={styles.benefitTitle}>{b.title}</div>
              <div className={styles.benefitBody}>{b.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

