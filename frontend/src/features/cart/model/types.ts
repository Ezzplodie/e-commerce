import type { StaticImageData } from "next/image";

export type CartItemImage = string | StaticImageData | null;

export type CartItemData = {
  id: number;
  title: string;
  size: string;
  color: string;
  quantity: number;
  badgeLabel?: string | number;
  price: number;
  image: CartItemImage;
};

export type CartStore = {
  items: CartItemData[];
  addItem: (item: CartItemData) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
};
