"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Sidebar from "@/components/admin/Sidebar";
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider";
import ThemeToggle from "@/components/admin/ThemeToggle";

// ─── Tab config for mobile nav ──────────────────────────
const tabGlassActive: Record<string, string> = {
  projects: "bg-blue-500/20 text-blue-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
  experiences: "bg-purple-500/20 text-purple-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
  reviews: "bg-amber-500/20 text-amber-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
  socials: "bg-green-500/20 text-green-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
};

const portfolioTabs = ["projects", "experiences", "reviews", "socials"] as const;

// ─── Inner layout (needs useSearchParams → must be inside Suspense) ─
function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Login page gets no chrome at all
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isPortfolio = pathname === "/admin/portfolio" || pathname === "/admin";
  const activeTab = searchParams.get("tab") || "projects";

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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#030412]/80 backdrop-blur-xl border-b border-white/[0.06] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md flex items-center justify-center">
              <span className="font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-sm">Admin Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-red-400 cursor-pointer">Sign Out</button>
          </div>
        </div>

        {/* Mobile tabs – only show for portfolio routes */}
        {isPortfolio && (
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {portfolioTabs.map((tab) => (
              <Link
                key={tab}
                href={`/admin/portfolio?tab=${tab}`}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize whitespace-nowrap cursor-pointer transition-colors border ${
                  activeTab === tab
                    ? `${tabGlassActive[tab].replace("border ", "")} font-medium`
                    : "border-transparent bg-white/[0.04] text-gray-400"
                }`}
              >
                {tab}
              </Link>
            ))}
          </div>
        )}

        {/* Mobile breadcrumb for PM pages */}
        {pathname.startsWith("/admin/pm") && (
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <Link
              href="/admin/pm"
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap cursor-pointer transition-colors border ${
                pathname === "/admin/pm"
                  ? "bg-indigo-500/20 text-indigo-200 border-white/10 font-medium"
                  : "border-transparent bg-white/[0.04] text-gray-400"
              }`}
            >
              All Projects
            </Link>
            <Link
              href="/admin/portfolio?tab=projects"
              className="px-3 py-1.5 rounded-lg text-xs whitespace-nowrap cursor-pointer transition-colors border border-transparent bg-white/[0.04] text-gray-400"
            >
              ← Portfolio
            </Link>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-8 pt-32 lg:pt-8 min-h-screen">
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
