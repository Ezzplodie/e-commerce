import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className={styles.header__logo}>
          <h1 className="h1">E-Commerce</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
