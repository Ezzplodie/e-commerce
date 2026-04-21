import { Address, ShippingAddress } from "../model/types";

const API_BASE = "http://localhost:4000";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return response.json() as Promise<T>;
}

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

export const findUserAddress = async (): Promise<Address> => {
  const response = await fetch(`${API_BASE}/addresses/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return parseResponse(response);
};
