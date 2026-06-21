import { Suspense } from "react";
import { AdminOrdersList } from "@/features/admin-orders/ui/AdminOrdersList";

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "24px var(--side-paddings, 20px)" }}>
          Loading orders…
        </div>
      }
    >
      <AdminOrdersList />
    </Suspense>
  );
}
