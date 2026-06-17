"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Sidebar from "@/components/admin/Sidebar";
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider";
import ThemeToggle from "@/components/admin/ThemeToggle";

// ─── Mobile nav config ──────────────────────────────────
const tabGlassActive: Record<string, string> = {
  projects: "bg-blue-500/20 text-blue-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
  experiences: "bg-purple-500/20 text-purple-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
  reviews: "bg-amber-500/20 text-amber-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
  socials: "bg-green-500/20 text-green-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
  pm: "bg-indigo-500/20 text-indigo-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
};

const mobileNavItems = [
  {
    key: "projects",
    label: "Projects",
    href: "/admin/portfolio?tab=projects",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    ),
  },
  {
    key: "experiences",
    label: "Roles",
    href: "/admin/portfolio?tab=experiences",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175A48.114 48.114 0 0012 6c-2.392 0-4.744.175-7.163.531C3.768 6.691 3 7.625 3 8.706v3.783c0 .64.275 1.252.75 1.661" />
    ),
  },
  {
    key: "reviews",
    label: "Reviews",
    href: "/admin/portfolio?tab=reviews",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    ),
  },
  {
    key: "socials",
    label: "Socials",
    href: "/admin/portfolio?tab=socials",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374" />
    ),
  },
  {
    key: "pm",
    label: "Tasks",
    href: "/admin/pm",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192A48.424 48.424 0 0012 3.75c-2.125 0-4.215.056-6.274.166C4.595 4.01 3.75 4.973 3.75 6.108v12.392A2.25 2.25 0 006 20.75h9.75" />
    ),
  },
] as const;

// ─── Inner layout (needs useSearchParams → must be inside Suspense) ─
function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Login page gets no chrome at all
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const activeTab = searchParams.get("tab") || "projects";
  const activeMobileKey = pathname.startsWith("/admin/pm") ? "pm" : activeTab;

  const handleLogout = () => {
    document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/admin";
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-[#030412] text-white relative">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#030412]/90 backdrop-blur-xl border-b border-white/[0.06] px-3 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md flex shrink-0 items-center justify-center">
              <span className="font-bold text-sm">B</span>
            </div>
            <div className="min-w-0">
              <span className="block truncate text-sm font-bold">Admin Panel</span>
              <span className="block truncate text-[11px] capitalize text-gray-500">
                {activeMobileKey === "pm" ? "Project management" : activeTab}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <ThemeToggle />
            <button onClick={handleLogout} className="min-h-10 rounded-xl px-2.5 text-xs text-gray-500 hover:text-red-400 hover:bg-white/[0.04] cursor-pointer">Exit</button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.06] bg-[#030412]/92 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur-xl">
        <div className="grid grid-cols-5 gap-1">
          {mobileNavItems.map((item) => {
            const isActive = activeMobileKey === item.key;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border text-[10px] font-medium transition-colors ${
                  isActive
                    ? tabGlassActive[item.key].replace("border ", "")
                    : "border-transparent bg-white/[0.03] text-gray-500"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                  {item.icon}
                </svg>
                <span className="leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen px-3 pb-28 pt-20 sm:px-4 md:p-8 md:pb-28 lg:ml-64 lg:pb-8 lg:pt-8">
        {children}
      </main>

      <style jsx>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scale-up {
          0% { opacity: 0; transform: scale(0.95); }
          50% { transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .animate-scale-up { animation: scale-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}

// ─── Exported layout (wraps inner in Suspense for useSearchParams) ─
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminThemeProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-[#030412] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
        </div>
      }>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </Suspense>
    </AdminThemeProvider>
  );
}
