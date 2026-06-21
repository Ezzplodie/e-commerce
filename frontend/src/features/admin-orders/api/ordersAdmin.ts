import { parseResponse } from "@/shared/api/parseResponse";
import { API_BASE } from "@/shared/api/config";
import type {
  AdminOrderWithItems,
  AdminOrdersListResponse,
  OrderStatusPatchResponse,
} from "../model/types";
import type { OrderStatusValue } from "../model/orderStatuses";

export async function fetchAdminOrdersList(params: {
  page?: number;
  limit?: number;
  status?: OrderStatusValue | "";
}): Promise<AdminOrdersListResponse> {
  const search = new URLSearchParams();
  if (params.page != null) search.set("page", String(params.page));
  if (params.limit != null) search.set("limit", String(params.limit));
  if (params.status) search.set("status", params.status);

  const qs = search.toString();
  const url = qs ? `${API_BASE}/orders/admin?${qs}` : `${API_BASE}/orders/admin`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse<AdminOrdersListResponse>(response);
}

export async function fetchAdminOrderWithItems(
  orderId: number,
): Promise<AdminOrderWithItems> {
  const response = await fetch(
    `${API_BASE}/orders/admin/${orderId}/items`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return parseResponse<AdminOrderWithItems>(response);
}

export async function patchOrderStatus(
  orderId: number,
  status: OrderStatusValue,
): Promise<OrderStatusPatchResponse> {
  const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  return parseResponse<OrderStatusPatchResponse>(response);
}
