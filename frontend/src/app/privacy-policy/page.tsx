import Header from "@/widgets/header";
import Footer from "@/widgets/footer";
import styles from "./page.module.scss";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.main}>
          <div className={styles.container}>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.subtitle}>
              This page explains how we collect and use your information.
            </p>

            <section className={styles.section} aria-labelledby="pp-data">
              <h2 className={styles.sectionTitle} id="pp-data">
                Information we collect
              </h2>
              <p className={styles.text}>
                We may collect information you provide during checkout and when
                contacting support, such as name, email, shipping address, and
                order details.
              </p>
              <ul className={styles.list}>
                <li>Contact and delivery information</li>
                <li>Order and account-related information</li>
                <li>Usage and device information</li>
              </ul>
            </section>

            <section className={styles.section} aria-labelledby="pp-use">
              <h2 className={styles.sectionTitle} id="pp-use">
                How we use information
              </h2>
              <p className={styles.text}>
                We use your information to process orders, provide customer
                support, improve the site, and comply with legal obligations.
              </p>
            </section>

            <section className={styles.section} aria-labelledby="pp-sharing">
              <h2 className={styles.sectionTitle} id="pp-sharing">
                Sharing
              </h2>
              <p className={styles.text}>
                We may share information with service providers required to
                fulfill orders (for example, shipping and payment providers) and
                as required by law.
              </p>
            </section>

            <section className={styles.section} aria-labelledby="pp-contact">
              <h2 className={styles.sectionTitle} id="pp-contact">
                Contact
              </h2>
              <p className={styles.text}>
                If you have questions about this policy, contact support using
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

