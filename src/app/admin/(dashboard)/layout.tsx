import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/authz";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/admin/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const supabase = await createClient();
  const { count: unreadCount } = await supabase
    .from("form_submissions")
    .select("*", { count: "exact", head: true })
    .eq("read", false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Sidebar unreadCount={unreadCount ?? 0} />
      <main className="ml-[240px] p-8 max-lg:ml-0 max-lg:pt-24">{children}</main>
    </div>
  );
}
