export const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export type OrderStatusValue = (typeof ORDER_STATUS_OPTIONS)[number]["value"];
