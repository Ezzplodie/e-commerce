import type { CartItemData } from "./types";

const TAX_RATE = 0.08;
const SHIPPING_COST = 0;

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

export function getCartPricing(items: CartItemData[]) {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = roundCurrency(
    items.reduce((total, item) => total + item.price * item.quantity, 0),
  );
  const tax = roundCurrency(subtotal * TAX_RATE);
  const shipping = SHIPPING_COST;
  const total = roundCurrency(subtotal + tax + shipping);

  return {
    itemCount,
    subtotal,
    tax,
    shipping,
    total,
  };
}
