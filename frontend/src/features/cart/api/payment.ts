import { parseResponse } from "@/shared/api/parseResponse";

const API_BASE = "http://localhost:4000";
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
