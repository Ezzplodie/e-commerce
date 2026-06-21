import { AdminOrderDetail } from "@/features/admin-orders/ui/AdminOrderDetail";

type Props = {
  params: Promise<{ orderId: string }>;
};

export default async function AdminOrderPage({ params }: Props) {
  const { orderId } = await params;
  return <AdminOrderDetail orderId={orderId} />;
}
