import Logo from "@/assets/icons/logo.svg";

const Header = () => {
  console.log(Logo);
  return (
    <div className="header">
      <div className="header__inner container">
        <div className="header__logo">
          <Logo
            width={120}
            height={40}
            className="fill-black hover:fill-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
