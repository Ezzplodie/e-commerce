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

export type CartFeedback = {
  item: CartItemData;
  addedQuantity: number;
  totalQuantity: number;
  timestamp: number;
};

export type CartStore = {
  items: CartItemData[];
  cartFeedback: CartFeedback | null;
  isOpen: boolean;
  addItem: (item: CartItemData) => void;
  dismissCartFeedback: () => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
};

export type ShippingAddress = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  postal_code: string;
  country: string;
  company?: string;
  address: string;
  apartment?: string;
};

export type Address = ShippingAddress & {
  id: number;
  user_id: number;
};

export type ShippingMethod = {
  id: number;
  name: string;
  price: number;
  estimated_days: number;
};

