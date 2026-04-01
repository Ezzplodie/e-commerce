import Link from "next/link";
import {
  AccessibilityIcon,
  ArrowForwardIcon,
  SocialMedia1Icon,
  SocialMedia2Icon,
  SocialMedia3Icon,
  SocialMediaIcon,
} from "@/shared/assets/icons";
import { TextInput } from "@/shared/ui/Input";
import styles from "./Footer.module.scss";

const FOOTER_MENUS = [
  {
    title: "About Modimal",
    links: ["Collection", "Sustainability", "Privacy Policy", "Support System", "Terms & Condition", "Copyright Notice"],
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
  { icon: SocialMediaIcon, link: "https://instagram.com/modimal", label: "Instagram" },
  { icon: SocialMedia1Icon, link: "https://facebook.com/modimal", label: "Facebook" },
  { icon: SocialMedia2Icon, link: "https://pinterest.com/modimal", label: "Pinterest" },
  { icon: SocialMedia3Icon, link: "https://tiktok.com/modimal", label: "TikTok" },
];

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.newsletterColumn}>
          <h2 className={styles.title}>
            Join our club, get 15% off for your Birthday
          </h2>

          <form className={styles.form}>
            <div className={styles.inputWrap}>
              <TextInput
                type="email"
                placeholder="Enter Your Email Address"
                className={styles.input}
              />

              <button
                type="submit"
                className={styles.submitButton}
                aria-label="Subscribe to the Modimal newsletter"
              >
                <ArrowForwardIcon width={16} height={16} />
              </button>
            </div>

            <label className={styles.checkboxRow}>
              <input type="checkbox" />
              <span>
                By Submitting your email, you agree to receive advertising emails
                from Modimal.
              </span>
            </label>
          </form>

          <div className={styles.socialRow}>
            <div className={styles.socialIcons}>
              {SOCIAL_MEDIA.map(({ icon: Icon, link, label }) => (
                <a
                  key={label}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialLink}
                  aria-label={`Visit Modimal on ${label}`}
                >
                  <Icon width={24} height={24} />
                </a>
              ))}
            </div>

            <span className={styles.copy}>© 2023 Modimal. All Rights Reserved.</span>
          </div>
        </div>

        <div className={styles.linksGrid}>
          {FOOTER_MENUS.map(({ title, links }) => (
            <div key={title} className={styles.menuColumn}>
              <h3 className={styles.menuTitle}>{title}</h3>

              <nav className={styles.menuNav} aria-label={title}>
                {links.map((link) => (
                  <Link key={link} href="/" className={styles.menuLink}>
                    {link}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className={styles.chatButton} aria-label="Accessibility options">
        <AccessibilityIcon width={24} height={24} />
      </button>
    </footer>
  );
};

export default Footer;
