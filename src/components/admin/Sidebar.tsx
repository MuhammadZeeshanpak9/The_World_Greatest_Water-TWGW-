"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  RefreshCw,
  Mail,
  Inbox,
  FileText,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import toast from "react-hot-toast";

type NavItem = { label: string; href: string; icon: LucideIcon; badge?: number };

export default function Sidebar({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Subscriptions", href: "/admin/subscriptions", icon: RefreshCw },
    { label: "Waitlist", href: "/admin/waitlist", icon: Mail },
    {
      label: "Form Submissions",
      href: "/admin/form-submissions",
      icon: Inbox,
      badge: unreadCount,
    },
    { label: "Blog Posts", href: "/admin/blog-posts", icon: FileText },
    { label: "Audit Log", href: "/admin/audit-log", icon: History },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const res = await fetch("/api/admin/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Sign out failed");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Sign out failed. Please try again.");
      setSigningOut(false);
    }
  }

  const navContent = (
    <div className="flex h-full flex-col bg-[#0F0A1E]">
      <div className="px-6 py-8">
        <Link href="/admin" className="font-cormorant text-2xl tracking-wide text-white">
          ELEV8 WATER
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 font-inter text-sm transition-colors ${
                active ? "bg-[#6B2FA0] text-white" : "text-white/50 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <item.icon size={18} />
                {item.label}
              </span>
              {!!item.badge && (
                <span className="rounded-full bg-[#EF4444] px-2 py-0.5 text-[11px] font-semibold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-inter text-sm text-white/50 transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444] disabled:opacity-50"
        >
          <LogOut size={18} />
          {signingOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] lg:block">
        {navContent}
      </aside>

      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-[#0F0A1E] px-4 py-4 lg:hidden">
        <span className="font-cormorant text-xl text-white">ELEV8 WATER</span>
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="text-white">
          <Menu size={24} />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[240px]">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 z-10 text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
