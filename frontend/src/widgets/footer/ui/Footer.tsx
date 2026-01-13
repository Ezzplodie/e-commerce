import styles from "./Footer.module.scss";
import clsx from "clsx";
import Instagram from "@/assets/icons/social media.svg";
import Facebook from "@/assets/icons/social media1.svg";
import Pinterest from "@/assets/icons/social media2.svg";
import TikTok from "@/assets/icons/social media3.svg";

const FOOTER_MENUS = [
  {
    title: "About Modimal",
    links: ["Collection", "New In", "Modiweek", "Plus Size", "Sustainability"],
  },
  {
    title: "Help & Support",
    links: ["Orders & Shipping", "Returns & Refunds", "FAQs", "Contact Us"],
  },
  {
    title: "Join Up",
    links: ["Modimal Club", "Careers", "Visit Us"],
  },
];


const SOCIAL_MEDIA = [
  { icon: Instagram, link: "https://instagram.com/modimal" },
  { icon: Facebook, link: "https://facebook.com/modimal" },
  { icon: Pinterest, link: "https://facebook.com/modimal" },
  { icon: TikTok, link: "https://facebook.com/modimal" },
];


const Footer = () => {
  return (
    <footer className="footer">
      <div className={clsx(styles.footerInner, "container")}>
        

        <div className={styles.social_box}>
          <h2 className={styles.footer_title}>
            Join our club, get 15% off for your Birthday
          </h2>

          <form method="post" className={styles.footer_form}>
            <input
              id="email"
              type="email"
              placeholder="Enter Your Email Address"
              required
            />

            <div className={styles.checkboxRow}>
              <input id="agree" type="checkbox" required />
              <label htmlFor="agree">
                By submitting your email, you agree to receive advertising emails from Modimal.
              </label>
            </div>

            <button type="submit" className={styles.submit_button} aria-label="Subscribe">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.9974 2.667L7.0574 3.607L10.7774 7.334H2.664V8.667H10.7774L7.0574 12.394L7.9974 13.334L13.3307 8.0003L7.9974 2.667Z"
                  fill="#fff"
                  stroke="#fff"
                />
              </svg>
            </button>
          </form>


<div className={styles.social_icons}>
  {SOCIAL_MEDIA.map(({ icon: Icon, link }) => (
    <div className={styles.social_icon_item} >
    <a
      key={link}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.social_icon}
    >
    </a>
    <Icon />
    </div>
  ))}
</div>



          <span className={styles.all_rights_reserved}>
            © 2026 Modimal. All Rights Reserved.
          </span>

        </div>


        <div className={styles.footer_menus}>
          {FOOTER_MENUS.map(({ title, links }) => (
            <div key={title} className={styles.menu_box}>
              <h3 className={styles.menu_box_title}>{title}</h3>
              <nav className={styles.menu_box_nav}>
                {links.map((link) => (
                  <a key={link} href="/" className={styles.navItem}>
                    {link}
                  </a>
                ))}
              </nav>
            </div>
          ))}

          <span className={styles.all_rights_reserved_mobile}>
            © 2026 Modimal. All Rights Reserved.
          </span>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
