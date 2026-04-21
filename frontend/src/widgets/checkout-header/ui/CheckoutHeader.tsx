import Link from "next/link";
import { LogoIcon } from "@/shared/assets/icons";
import styles from "./CheckoutHeader.module.scss";

export function CheckoutHeader() {
  return (
    <header className={styles.header}>
      <div className={`${styles.inner} container`}>
        <Link href="/" className={styles.logoLink} aria-label="Modimal home">
          <LogoIcon width={184} height={46} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
