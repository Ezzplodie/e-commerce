import type { Address, CartItemData } from "../model/types";
import { parseResponse } from "@/shared/api/parseResponse";

const API_BASE = "http://localhost:4000";

export type CreateOrderPayload = {
  shipping: Address;
  shippingCost: number;
  items: CartItemData[];
};

export type CreatedOrder = {
  id: number;
};

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<CreatedOrder> {
  const response = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      shipping_first_name: payload.shipping.first_name,
      shipping_last_name: payload.shipping.last_name,
      shipping_cost: payload.shippingCost,
      shipping_email: payload.shipping.email,
      shipping_phone: payload.shipping.phone,
      shipping_city: payload.shipping.city,
      shipping_address: payload.shipping.address,
      shipping_postal_code: payload.shipping.postal_code,
      shipping_country: payload.shipping.country,
      shipping_company: payload.shipping.company || undefined,
      shipping_apartment: payload.shipping.apartment || undefined,
      items: payload.items.map((item) => ({
        variant_id: item.id,
        quantity: item.quantity,
      })),
    }),
  });

  return parseResponse<CreatedOrder>(response);
}

