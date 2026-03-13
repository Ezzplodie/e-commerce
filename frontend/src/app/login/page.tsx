import Header from "@/widgets/header";
import Footer from "@/widgets/footer";
import styles from "./page.module.scss";
import { LoginForm } from "@/features/login/ui/LoginForm";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.card} aria-labelledby="login-title">
          <LoginForm></LoginForm>
        </section>
      </main>
      <Footer />
    </div>
  );
}
