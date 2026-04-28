"use client";

import clsx from "clsx";
import Image from "next/image";
import styles from "./CollectionDropdown.module.scss";
import type { MenuItem } from "@/entities/navigation";
import { blousesImage, plusSizeImage } from "@/shared/assets/images";
import DropdownContent from "./DropdownContent";

type Props = {
  content: MenuItem[];
  className?: string;
};

const CollectionDropdown = ({ content, className }: Props) => {
  return (
    <DropdownContent className={className}>
      <div className={clsx(styles.column, styles.menusBlock)}>
        {content.map((menu) => (
          <div key={menu.key} className={clsx(styles.column)}>
            <h3 className={styles.title}>{menu.label}</h3>
            <ul className={styles.list}>
              {menu.items.map((link) => (
                <li key={link.id}>
                  <a href={link.href} className={styles.link}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className={clsx(
          styles.column,
          styles.imagesBlock,
          styles.customImagesBlock,
        )}
      >
        {[
          { src: blousesImage, alt: "Blouses collection preview", label: "Blouses" },
          { src: plusSizeImage, alt: "Plus Size collection preview", label: "Plus Size" },
        ].map((image) => (
          <a
            key={image.label}
            type="button"
            aria-label={image.label}
            className={clsx(styles.column, styles.imageBox)}
          >
            <Image src={image.src} alt={image.alt} />
            <span className={styles.imageText}>{image.label}</span>
          </a>
        ))}
      </div>
    </DropdownContent>
  );
};

export default CollectionDropdown;
