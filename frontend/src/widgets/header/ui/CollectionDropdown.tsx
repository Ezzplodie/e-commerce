"use client";

import clsx from "clsx";
import Image from "next/image";
import dropdownStyles from "@/shared/ui/Dropdown/Dropdown.module.scss";
import styles from "./CollectionDropdown.module.scss";
import { MenuItem } from "@/entities/navigation/types";
import { blousesImage, plusSizeImage } from "@/shared/assets/images";
import DropdownContent from "./DropdownContent";

type Props = {
  content: MenuItem[];
  className?: string;
};

const CollectionDropdown = ({ content, className }: Props) => {
  return (
    <DropdownContent className={className}>
      <div className={clsx(dropdownStyles.column, dropdownStyles.menusBlock)}>
        {content.map((menu) => (
          <div key={menu.key} className={clsx(dropdownStyles.column)}>
            <h3 className={dropdownStyles.title}>{menu.label}</h3>
            <ul className={dropdownStyles.list}>
              {menu.items.map((link) => (
                <li key={link.id}>
                  <a href={link.href} className={dropdownStyles.link}>
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
          dropdownStyles.column,
          dropdownStyles.imagesBlock,
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
            className={clsx(dropdownStyles.column, dropdownStyles.imageBox)}
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
