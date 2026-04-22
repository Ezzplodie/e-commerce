import { ShippingMethod } from "../model/types";

const API_BASE = "http://localhost:4000";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return response.json() as Promise<T>;
}

export const getAllShippingMethods = async (): Promise<ShippingMethod[]> => {
  const result = await fetch(`${API_BASE}/shipping-methods`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const methods = await parseResponse<ShippingMethod[]>(result);
  return methods.map((method) => ({
    ...method,
    price: Number(method.price),
  }));
};
