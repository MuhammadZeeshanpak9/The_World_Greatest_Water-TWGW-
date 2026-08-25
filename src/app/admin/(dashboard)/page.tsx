import { ShoppingBag, DollarSign, Users, RefreshCw, Mail, Package } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";
import RecentSubmissionsTable from "@/components/admin/RecentSubmissionsTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { getDashboardStats } from "@/lib/supabase/getDashboardStats";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatDayLabel(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" });
}

function formatShortDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const WEEK_LABELS = ["3 Weeks Ago", "2 Weeks Ago", "Last Week", "This Week"];

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const maxRevenue = Math.max(...stats.revenueByDay.map((d) => d.revenue), 1);
  const maxWeekRevenue = Math.max(...stats.revenueByWeek.map((w) => w.revenue), 1);
  const maxOrderStatusCount = Math.max(...stats.ordersByStatus.map((s) => s.count), 1);
  const maxProductQty = Math.max(...stats.topProducts.map((p) => p.quantity), 1);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl text-white">Welcome, Admin</h1>
        <p className="mt-1 font-inter text-sm text-white/50">{today}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={ShoppingBag} value={stats.totalOrders} label="Total Orders" />
        <StatCard
          icon={DollarSign}
          value={formatCurrency(stats.totalRevenue)}
          label="Total Revenue"
        />
        <StatCard icon={Users} value={stats.totalCustomers} label="Total Customers" />
        <StatCard
          icon={RefreshCw}
          value={stats.activeSubscriptions}
          label="Active Subscriptions"
        />
        <StatCard icon={Mail} value={stats.waitlistSignups} label="Waitlist Signups" />
        <StatCard icon={Package} value={stats.totalProducts} label="Total Products" />
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-cormorant text-2xl text-white">Revenue — Last 7 Days</h2>
        <div className="mt-6 flex h-40 items-end gap-3">
          {stats.revenueByDay.map((day) => (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-full w-full items-end">
                <div
                  className="w-full rounded-t bg-[#6B2FA0]"
                  style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, 2)}%` }}
                  title={formatCurrency(day.revenue)}
                />
              </div>
              <span className="font-inter text-[11px] text-white/40">
                {formatDayLabel(day.date)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-cormorant text-2xl text-white">Orders by Status</h2>
          <div className="mt-5 space-y-3">
            {stats.ordersByStatus.length === 0 ? (
              <p className="font-inter text-sm text-white/40">No orders yet.</p>
            ) : (
              stats.ordersByStatus.map((s) => (
                <div key={s.status} className="flex items-center gap-3">
                  <div className="w-28 shrink-0">
                    <StatusBadge status={s.status} />
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-[#6B2FA0]"
                      style={{ width: `${Math.max((s.count / maxOrderStatusCount) * 100, 4)}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right font-inter text-sm text-white/60">
                    {s.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-cormorant text-2xl text-white">Revenue — Last 4 Weeks</h2>
          <div className="mt-6 flex h-40 items-end gap-4">
            {stats.revenueByWeek.map((week, i) => (
              <div key={week.weekStart} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t bg-[#6B2FA0]"
                    style={{ height: `${Math.max((week.revenue / maxWeekRevenue) * 100, 2)}%` }}
                    title={formatCurrency(week.revenue)}
                  />
                </div>
                <span className="text-center font-inter text-[11px] text-white/40">
                  {WEEK_LABELS[i]}
                  <br />
                  {formatShortDate(week.weekStart)}–{formatShortDate(week.weekEnd)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-cormorant text-2xl text-white">Top 5 Products</h2>
          <div className="mt-5 space-y-3">
            {stats.topProducts.length === 0 ? (
              <p className="font-inter text-sm text-white/40">No product sales yet.</p>
            ) : (
              stats.topProducts.map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 truncate font-inter text-sm text-white/80" title={p.name}>
                    {p.name}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-[#3DD6CB]"
                      style={{ width: `${Math.max((p.quantity / maxProductQty) * 100, 4)}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right font-inter text-sm text-white/60">
                    {p.quantity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-cormorant text-2xl text-white">Waitlist & Courses</h2>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <div className="font-cormorant text-3xl text-white">{stats.waitlistStats.total}</div>
              <div className="mt-0.5 font-inter text-xs text-white/50">Waitlist Total</div>
            </div>
            <div>
              <div className="font-cormorant text-3xl text-white">{stats.waitlistStats.net}</div>
              <div className="mt-0.5 font-inter text-xs text-white/50">Waitlist Net</div>
            </div>
            <div>
              <div className="font-cormorant text-3xl text-white">
                {stats.waitlistStats.unsubscribed}
              </div>
              <div className="mt-0.5 font-inter text-xs text-white/50">Unsubscribed</div>
            </div>
            <div>
              <div className="font-cormorant text-3xl text-white">
                {stats.waitlistStats.newThisWeek}
              </div>
              <div className="mt-0.5 font-inter text-xs text-white/50">New This Week</div>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-cormorant text-3xl text-white">
                  {stats.courseStats.totalEnrollments}
                </div>
                <div className="mt-0.5 font-inter text-xs text-white/50">Course Enrollments</div>
              </div>
              <div>
                <div className="font-cormorant text-3xl text-white">
                  {stats.courseStats.totalCompletions}
                </div>
                <div className="mt-0.5 font-inter text-xs text-white/50">Course Completions</div>
              </div>
            </div>
            {stats.courseStats.mostEnrolledCourse && (
              <p className="mt-4 font-inter text-xs text-white/50">
                Most enrolled:{" "}
                <span className="text-white/80">{stats.courseStats.mostEnrolledCourse.title}</span>{" "}
                ({stats.courseStats.mostEnrolledCourse.count})
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div>
          <h2 className="mb-3 font-cormorant text-2xl text-white">Recent Orders</h2>
          <RecentOrdersTable orders={stats.recentOrders} />
        </div>

        <div>
          <h2 className="mb-3 font-cormorant text-2xl text-white">Recent Form Submissions</h2>
          <RecentSubmissionsTable submissions={stats.recentSubmissions} />
        </div>
      </div>
    </div>
  );
}
