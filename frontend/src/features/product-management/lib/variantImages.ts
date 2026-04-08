import { VariantImage } from "@/entities/product/types";

export const moveItem = <T,>(items: T[], fromIndex: number, toIndex: number) => {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);

  if (movedItem === undefined) {
    return nextItems;
  }

  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
};

export const sortVariantImages = (images: VariantImage[]) =>
  [...images].sort((left, right) => {
    const leftOrder = Number.isFinite(left.image_order) ? left.image_order : 0;
    const rightOrder = Number.isFinite(right.image_order)
      ? right.image_order
      : 0;

    if (leftOrder === rightOrder) {
      return left.id - right.id;
    }

    return leftOrder - rightOrder;
  });

export const getNextVariantImageOrder = (images: VariantImage[]) =>
  images.reduce(
    (highestOrder, image) =>
      Math.max(highestOrder, Number(image.image_order) || 0),
    -1,
  ) + 1;
