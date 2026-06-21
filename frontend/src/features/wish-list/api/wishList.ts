import { API_BASE } from "@/shared/api/config";
import { WishListItem } from "../model/types";
import { parseResponse } from "@/shared/api/parseResponse";

export const getWishList = async (): Promise<WishListItem[]> => {
  const response = await fetch(`${API_BASE}/wish-lists`, {
    method: "GET",
    credentials: "include",
  });
  return parseResponse<WishListItem[]>(response);
};

export const addItemToWishList = async (
  variantId: number,
): Promise<WishListItem> => {
  const response = await fetch(`${API_BASE}/wish-lists`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ variant_id: variantId }),
  });
  return parseResponse<WishListItem>(response);
};

export const deleteItemFromWishList = async (
  variantId: number,
): Promise<void> => {
  const response = await fetch(`${API_BASE}/wish-lists/${variantId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return parseResponse<void>(response);
};
