import clsx from "clsx";
import styles from "./Header.module.scss";
import Logo from "@/assets/icons/logo.svg";

const Header = () => {
  return (
    <header className="header">
      <div className={clsx(styles.headerInner, "container")}>
        <div className={styles.headerLogo}>
          <Logo width={184} height={46} className="logo" />
        </div>

        <nav className={styles.nav}>
          <a href="#" className={styles.navItem}>
            Collection
          </a>
          <a href="#" className={styles.navItem}>
            New In
          </a>
          <a href="#" className={styles.navItem}>
            Modiweek
          </a>
          <a href="#" className={styles.navItem}>
            Plus Size
          </a>
          <a href="#" className={styles.navItem}>
            Sustainability
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
