import Header from "@/widgets/header";
import Footer from "@/widgets/footer";
import styles from "./page.module.scss";

export default function TermsOfSalePage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.main}>
          <div className={styles.container}>
            <h1 className={styles.title}>Terms of Sale</h1>
            <p className={styles.subtitle}>
              These terms apply to purchases made on this website.
            </p>

            <section className={styles.section} aria-labelledby="tos-orders">
              <h2 className={styles.sectionTitle} id="tos-orders">
                Orders &amp; Payments
              </h2>
              <p className={styles.text}>
                By placing an order, you agree to provide accurate information
                and authorize payment using your selected payment method.
              </p>
              <ul className={styles.list}>
                <li>Prices and availability may change without notice.</li>
                <li>We may cancel or refuse an order in limited cases.</li>
              </ul>
            </section>

            <section className={styles.section} aria-labelledby="tos-shipping">
              <h2 className={styles.sectionTitle} id="tos-shipping">
                Shipping
              </h2>
              <p className={styles.text}>
                Shipping options and estimated delivery times are displayed at
                checkout. Delivery estimates are not guarantees.
              </p>
            </section>

            <section className={styles.section} aria-labelledby="tos-returns">
              <h2 className={styles.sectionTitle} id="tos-returns">
                Returns &amp; Refunds
              </h2>
              <p className={styles.text}>
                Return eligibility and refund timing depend on the condition of
                items and the return method. Some items may be non-returnable.
              </p>
            </section>

            <section className={styles.section} aria-labelledby="tos-contact">
              <h2 className={styles.sectionTitle} id="tos-contact">
                Contact
              </h2>
              <p className={styles.text}>
                If you have questions about these terms, contact support using
                the details on the site.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

