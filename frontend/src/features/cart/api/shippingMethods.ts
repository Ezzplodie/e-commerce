import { ShippingMethod } from "../model/types";
import { parseResponse } from "@/shared/api/parseResponse";
import { API_BASE } from "@/shared/api/config";

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
