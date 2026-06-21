import { parseResponse } from "@/shared/api/parseResponse";
import { API_BASE } from "@/shared/api/config";

export const createPaymentIntent = async (orderId: number) => {
  const response = await fetch(
    `${API_BASE}/orders/${orderId}/create-payment-intent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
  return parseResponse<{ clientSecret: string | null; alreadyPaid?: boolean }>(
    response,
  );
};
