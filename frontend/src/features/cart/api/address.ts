import { Address, ShippingAddress } from "../model/types";
import { parseResponse } from "@/shared/api/parseResponse";

const API_BASE = "http://localhost:4000";

export const createAddress = async (
  data: ShippingAddress,
): Promise<Address> => {
  const response = await fetch(`${API_BASE}/addresses/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return parseResponse(response);
};

export const findUserAddress = async (): Promise<Address | null> => {
  const response = await fetch(`${API_BASE}/addresses/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  // If user has no saved address yet, backend returns `null` (200).
  // Callers should handle `null` as "no address saved".
  return parseResponse<Address | null>(response);
};
