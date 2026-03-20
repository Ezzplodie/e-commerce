import Link from "next/link";
import styles from "./Footer.module.scss";
import clsx from "clsx";
import {
  SocialMediaIcon,
  SocialMedia1Icon,
  SocialMedia2Icon,
  SocialMedia3Icon,
  ArrowForwardIcon,
} from "@/shared/assets/icons";

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
  { icon: SocialMediaIcon, link: "https://instagram.com/modimal" },
  { icon: SocialMedia1Icon, link: "https://facebook.com/modimal" },
  { icon: SocialMedia2Icon, link: "https://pinterest.com/modimal" },
  { icon: SocialMedia3Icon, link: "https://tiktok.com/modimal" },
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
              <ArrowForwardIcon width={16} height={16} />
            </button>
          </form>


<div className={styles.social_icons}>
  {SOCIAL_MEDIA.map(({ icon: Icon, link }) => (
    <div key={link} className={styles.social_icon_item}>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.social_icon}
        aria-label={`Visit our ${link.includes("instagram") ? "Instagram" : link.includes("facebook") ? "Facebook" : link.includes("pinterest") ? "Pinterest" : "TikTok"} page`}
      >
        <Icon />
      </a>
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
                  <Link key={link} href="/" className={styles.navItem}>
                    {link}
                  </Link>
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
