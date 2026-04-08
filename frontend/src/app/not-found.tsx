import Link from "next/link";
import Header from "@/widgets/header";
import Footer from "@/widgets/footer/ui/Footer";
import { Button } from "@/shared/ui/Button";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={styles.wrapper}>
        <div className={styles.content}>
          <span className={styles.code}>404</span>
          <h1 className={styles.title}>Page Not Found</h1>
          <p className={styles.description}>
            Sorry, the page you are looking for doesn&apos;t exist or has been
            moved.
          </p>
          <div className={styles.actions}>
            <Link href="/">
              <Button>Back to Homepage</Button>
            </Link>
            <Link href="/" className={styles.secondaryLink}>
              Contact Support
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
