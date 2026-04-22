const API_BASE = "http://localhost:4000";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return response.json() as Promise<T>;
}
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
  return parseResponse<{ clientSecret: string }>(response);
};
