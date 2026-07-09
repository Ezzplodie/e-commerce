import Link from "next/link";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import styles from "./EditorialSection.module.scss";
import bannerImage from "@/shared/assets/images/home/editorial-men.jpg";
export function EditorialSection() {
  return (
    <section className={styles.editorial} aria-label="Sustainability editorial">
      <Container
        className={styles.container}
        size="narrow"
        outerStyle={{
          backgroundImage: `url(${bannerImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className={styles.banner}>
          <div className={styles.content}>
            <h2 className={styles.title}>
              Stylish sustainability in clothing promotes eco‑friendly choices
              for a greater future
            </h2>
            <Button
              as={Link}
              href="/products"
              variant="secondary"
              className={styles.cta}
            >
              Sustainability
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
