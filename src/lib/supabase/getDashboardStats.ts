import { createAdminClient } from "./admin";

type OrderItem = { product_id?: string; name?: string; quantity?: number; price?: number };

function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

export async function getDashboardStats() {
  const admin = createAdminClient();

  const [
    { count: totalOrders },
    { data: allOrders },
    { count: totalCustomers },
    { count: activeSubscriptions },
    { count: waitlistSignups },
    { count: totalProducts },
    { data: recentOrders },
    { data: recentSubmissions },
    { data: waitlistRows },
    { count: unsubscribedCount },
    { data: enrollments },
  ] = await Promise.all([
    admin.from("orders").select("*", { count: "exact", head: true }),
    admin.from("orders").select("total, created_at, status, items"),
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
    admin.from("waitlist").select("created_at"),
    admin.from("newsletter_unsubscribes").select("*", { count: "exact", head: true }),
    admin.from("course_enrollments").select("course_slug, course_title, completed_at"),
  ]);

  const totals = allOrders ?? [];
  const totalRevenue = totals.reduce((sum, o) => sum + Number(o.total ?? 0), 0);

  const revenueByDay: { date: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = dateStr(i);
    const dayRevenue = totals
      .filter((o) => typeof o.created_at === "string" && o.created_at.slice(0, 10) === day)
      .reduce((sum, o) => sum + Number(o.total ?? 0), 0);
    revenueByDay.push({ date: day, revenue: dayRevenue });
  }

  // Orders by status — every distinct status present, not a fixed enum list.
  const ordersByStatusMap = new Map<string, number>();
  for (const o of totals) {
    const status = typeof o.status === "string" && o.status ? o.status : "unknown";
    ordersByStatusMap.set(status, (ordersByStatusMap.get(status) ?? 0) + 1);
  }
  const ordersByStatus = Array.from(ordersByStatusMap.entries()).map(([status, count]) => ({
    status,
    count,
  }));

  // Revenue over the last 4 weeks — 4 rolling 7-day buckets ending today, not calendar weeks.
  const revenueByWeek: { weekStart: string; weekEnd: string; revenue: number }[] = [];
  for (let w = 3; w >= 0; w--) {
    const weekEnd = dateStr(w * 7);
    const weekStart = dateStr(w * 7 + 6);
    const revenue = totals
      .filter((o) => {
        const day = typeof o.created_at === "string" ? o.created_at.slice(0, 10) : "";
        return day >= weekStart && day <= weekEnd;
      })
      .reduce((sum, o) => sum + Number(o.total ?? 0), 0);
    revenueByWeek.push({ weekStart, weekEnd, revenue });
  }

  // Top 5 products by quantity sold, parsed from each order's items JSON array.
  const productQtyMap = new Map<string, number>();
  for (const o of totals) {
    const items = Array.isArray(o.items) ? (o.items as OrderItem[]) : [];
    for (const item of items) {
      const name = item.name ?? "Unknown product";
      productQtyMap.set(name, (productQtyMap.get(name) ?? 0) + (Number(item.quantity) || 0));
    }
  }
  const topProducts = Array.from(productQtyMap.entries())
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Waitlist stats.
  const waitlistTotal = waitlistRows?.length ?? 0;
  const weekAgo = dateStr(6);
  const waitlistNewThisWeek = (waitlistRows ?? []).filter(
    (r) => typeof r.created_at === "string" && r.created_at.slice(0, 10) >= weekAgo,
  ).length;
  const waitlistStats = {
    total: waitlistTotal,
    unsubscribed: unsubscribedCount ?? 0,
    net: waitlistTotal - (unsubscribedCount ?? 0),
    newThisWeek: waitlistNewThisWeek,
  };

  // Course stats.
  const enrollmentRows = enrollments ?? [];
  const totalEnrollments = enrollmentRows.length;
  const totalCompletions = enrollmentRows.filter((e) => !!e.completed_at).length;
  const enrollmentsByCourse = new Map<string, number>();
  for (const e of enrollmentRows) {
    const title = e.course_title ?? e.course_slug;
    enrollmentsByCourse.set(title, (enrollmentsByCourse.get(title) ?? 0) + 1);
  }
  let mostEnrolledCourse: { title: string; count: number } | null = null;
  for (const [title, count] of enrollmentsByCourse.entries()) {
    if (!mostEnrolledCourse || count > mostEnrolledCourse.count) {
      mostEnrolledCourse = { title, count };
    }
  }
  const courseStats = {
    totalEnrollments,
    totalCompletions,
    mostEnrolledCourse,
  };

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
    ordersByStatus,
    revenueByWeek,
    topProducts,
    waitlistStats,
    courseStats,
  };
}
