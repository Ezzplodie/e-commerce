import styles from "./AddToWishListButton.module.scss";
import { Heart } from "lucide-react";
type Props = {
  variantId: number;
  title: string;
};
export const AddToWishListButton = ({ variantId, title }: Props) => {
  console.log(variantId);
  return (
    <button
      type="button"
      className={styles.wishlist}
      aria-label={`Save ${title}`}
      onClick={() => {
        console.log(variantId);
      }}
    >
      <Heart size={16} strokeWidth={1.8} />
    </button>
  );
};
