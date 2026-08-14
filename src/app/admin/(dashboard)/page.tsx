import { ShoppingBag, DollarSign, Users, RefreshCw, Mail, Package } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";
import RecentSubmissionsTable from "@/components/admin/RecentSubmissionsTable";
import { getDashboardStats } from "@/lib/supabase/getDashboardStats";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatDayLabel(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" });
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const maxRevenue = Math.max(...stats.revenueByDay.map((d) => d.revenue), 1);
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
