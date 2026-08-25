import AdminShippingDetail from "@/components/admin/AdminShippingDetail";

type Params = { params: Promise<{ orderId: string }> };

export default async function AdminShippingDetailPage({ params }: Params) {
  const { orderId } = await params;
  return <AdminShippingDetail orderId={orderId} />;
}
