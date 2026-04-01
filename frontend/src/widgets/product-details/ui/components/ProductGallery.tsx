import clsx from "clsx";
import Image, { StaticImageData } from "next/image";
import styles from "./ProductGallery.module.scss";

export type GalleryImage = {
  key: string;
  src: string | StaticImageData;
  alt: string;
};

type Props = {
  images: GalleryImage[];
  productName: string;
  activeIndex: number;
  onSelectImage: (index: number) => void;
};

export function ProductGallery({
  images,
  productName,
  activeIndex,
  onSelectImage,
}: Props) {
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className={styles.gallery}>
      {images.length > 1 ? (
        <div className={styles.thumbRail} aria-label={`${productName} thumbnails`}>
          {images.map((image, index) => (
            <button
              key={image.key}
              type="button"
              className={clsx(
                styles.thumbButton,
                activeIndex === index && styles.thumbButtonActive,
              )}
              onClick={() => onSelectImage(index)}
              aria-label={`Show ${productName} image ${index + 1}`}
              aria-pressed={activeIndex === index}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className={styles.thumbImage}
                sizes="(max-width: 767px) 84px, 125px"
              />
            </button>
          ))}
        </div>
      ) : null}

      <div className={styles.mainFrame}>
        <Image
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          className={styles.mainImage}
          priority
          sizes="(max-width: 767px) calc(100vw - 40px), 459px"
        />
      </div>
    </div>
  );
}
