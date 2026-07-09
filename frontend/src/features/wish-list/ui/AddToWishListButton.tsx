import clsx from "clsx";
import { useWishListStore } from "../model/wishListStore";
import styles from "./AddToWishListButton.module.scss";
import { Heart } from "lucide-react";
type Props = {
  variantId: number;
  title: string;
};

export const AddToWishListButton = ({ variantId, title }: Props) => {
  const isSaved = useWishListStore((s) =>
    s.items.some((i) => Number(i.variant_id) === Number(variantId)),
  );
  const add = useWishListStore((s) => s.add);

  return (
    <button
      type="button"
      className={clsx(styles.wishlist, isSaved && styles.saved)}
      aria-label={`Save ${title}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        add(variantId);
      }}
    >
      <Heart size={16} strokeWidth={1.8} />
    </button>
  );
};
