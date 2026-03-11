import Header from "@/widgets/header";
import Footer from "@/widgets/footer";
import styles from "./page.module.scss";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.card} aria-labelledby="login-title">
          <p className={styles.kicker}>Welcome back</p>
          <h1 id="login-title" className={styles.title}>
            Log in to your account
          </h1>
          <p className={styles.subtitle}>
            Enter your email and password to continue.
          </p>

          <form className={styles.form}>
            <label className={styles.field}>
              <span>Email</span>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                autoComplete="email"
              />
            </label>

            <label className={styles.field}>
              <span>Password</span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </label>

            <button type="submit" className={styles.submit}>
              Log In
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
