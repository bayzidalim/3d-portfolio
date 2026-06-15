"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/admin/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Login page gets no chrome at all
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isPortfolio = pathname === "/admin/portfolio" || pathname === "/admin";
  const activeTab = searchParams.get("tab") || "projects";

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030412] text-gray-900 dark:text-white relative transition-colors duration-300">
      {/* Desktop Sidebar */}
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#030412]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/[0.06] p-4 transition-colors duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 -ml-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-200 border border-blue-500/20 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md flex items-center justify-center">
              <span className="font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-sm">Admin Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
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
                    : "border-transparent bg-gray-100 dark:bg-white/[0.04] text-gray-600 dark:text-gray-400"
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
                  ? "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-200 border-indigo-500/20 dark:border-white/10 font-medium"
                  : "border-transparent bg-gray-100 dark:bg-white/[0.04] text-gray-600 dark:text-gray-400"
              }`}
            >
              All Projects
            </Link>
            <Link
              href="/admin/portfolio?tab=projects"
              className="px-3 py-1.5 rounded-lg text-xs whitespace-nowrap cursor-pointer transition-colors border border-transparent bg-gray-100 dark:bg-white/[0.04] text-gray-600 dark:text-gray-400"
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

import { ThemeProvider } from "@/components/ThemeProvider";

// ─── Exported layout (wraps inner in Suspense for useSearchParams) ─
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-[#030412] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin" />
        </div>
      }>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </Suspense>
    </ThemeProvider>
  );
}
