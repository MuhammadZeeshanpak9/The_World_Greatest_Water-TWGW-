import { createAdminClient } from "./admin";

export async function getDashboardStats() {
  const admin = createAdminClient();

  const [
    { count: totalOrders },
    { data: orderTotals },
    { count: totalCustomers },
    { count: activeSubscriptions },
    { count: waitlistSignups },
    { count: totalProducts },
    { data: recentOrders },
    { data: recentSubmissions },
  ] = await Promise.all([
    admin.from("orders").select("*", { count: "exact", head: true }),
    admin.from("orders").select("total, created_at"),
    admin.from("customers").select("*", { count: "exact", head: true }),
    admin
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    admin.from("waitlist").select("*", { count: "exact", head: true }),
    admin.from("products").select("*", { count: "exact", head: true }),
    admin.from("orders").select("*").order("created_at", { ascending: false }).limit(10),
    admin
      .from("form_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totals = orderTotals ?? [];
  const totalRevenue = totals.reduce((sum, o) => sum + Number(o.total ?? 0), 0);

  const revenueByDay: { date: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayRevenue = totals
      .filter((o) => typeof o.created_at === "string" && o.created_at.slice(0, 10) === dateStr)
      .reduce((sum, o) => sum + Number(o.total ?? 0), 0);
    revenueByDay.push({ date: dateStr, revenue: dayRevenue });
  }

  return {
    totalOrders: totalOrders ?? 0,
    totalRevenue,
    totalCustomers: totalCustomers ?? 0,
    activeSubscriptions: activeSubscriptions ?? 0,
    waitlistSignups: waitlistSignups ?? 0,
    totalProducts: totalProducts ?? 0,
    revenueByDay,
    recentOrders: recentOrders ?? [],
    recentSubmissions: recentSubmissions ?? [],
  };
}
