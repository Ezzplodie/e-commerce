import Header from "@/widgets/header";
import Footer from "@/widgets/footer";
import styles from "./page.module.scss";
import { RegisterForm } from "@/features/register";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.card} aria-labelledby="register-title">
          <div className={styles.header}>
            <h1 className={styles.title} id="register-title">
              Create account
            </h1>
            <p className={styles.subtitle}>
              Already have an account? <Link href="/login">Log in</Link>
            </p>
          </div>

          <RegisterForm />
        </section>
      </main>

      <Footer />
    </div>
  );
}

