"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

// ─── Icons ──────────────────────────────────────────────
const IconProjects = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  </svg>
);
const IconExperiences = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);
const IconReviews = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);
const IconSocials = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374" />
  </svg>
);
const IconPM = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

// ─── Portfolio tab config ───────────────────────────────
const portfolioTabs = [
  { key: "projects", label: "Projects", Icon: IconProjects, color: "blue" },
  { key: "experiences", label: "Experiences", Icon: IconExperiences, color: "purple" },
  { key: "reviews", label: "Reviews", Icon: IconReviews, color: "amber" },
  { key: "socials", label: "Socials", Icon: IconSocials, color: "green" },
] as const;

const tabActiveStyles: Record<string, string> = {
  projects: "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-200 border border-blue-500/20 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
  experiences: "bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-200 border border-purple-500/20 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
  reviews: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-200 border border-amber-500/20 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
  socials: "bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-200 border border-green-500/20 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
};

// ─── Types ──────────────────────────────────────────────
interface PMProject {
  _id: string;
  title: string;
}

interface SidebarProps {
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

// ─── Sidebar Component ──────────────────────────────────
export default function Sidebar({ mobileMenuOpen = false, setMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine active context
  const isPortfolioActive = pathname === "/admin/portfolio" || pathname === "/admin";
  const isPMActive = pathname.startsWith("/admin/pm");
  const activeTab = searchParams.get("tab") || "projects";

  // Collapsible sections – auto-expand the active one
  const [portfolioOpen, setPortfolioOpen] = useState(isPortfolioActive);
  const [pmOpen, setPMOpen] = useState(isPMActive);

  // PM projects for dynamic nav
  const [pmProjects, setPMProjects] = useState<PMProject[]>([]);
  const [pmLoading, setPMLoading] = useState(false);

  // Fetch PM projects on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPMLoading(true);
      try {
        const res = await fetch("/api/pm/projects");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setPMProjects(Array.isArray(data) ? data : data.projects || []);
        }
      } catch {
        // PM API may not exist yet — that's fine
      }
      if (!cancelled) setPMLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  // Keep sections in sync when route changes
  useEffect(() => {
    if (isPortfolioActive) setPortfolioOpen(true);
    if (isPMActive) setPMOpen(true);
  }, [isPortfolioActive, isPMActive]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = "/admin/login";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[45]"
          onClick={() => setMobileMenuOpen?.(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-50 dark:bg-[#030412] border-r border-gray-200 dark:border-white/[0.06] p-6 flex flex-col z-[50] transition-transform duration-300 ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        {/* ── Brand ─────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-200 border border-blue-500/20 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md flex items-center justify-center">
              <span className="font-bold text-lg">B</span>
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">Bayzid Alim</p>
              <p className="text-[11px] text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen?.(false)} 
            className="lg:hidden p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

      {/* ── Navigation ────────────────────────────────── */}
      <nav className="flex-1 space-y-4 overflow-y-auto">
        {/* Section 1: Portfolio Contents */}
        <div>
          <button
            onClick={() => setPortfolioOpen((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-1.5 group cursor-pointer"
          >
            <span className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold group-hover:text-gray-400 transition-colors">
              Portfolio Contents
            </span>
            <ChevronIcon open={portfolioOpen} />
          </button>

          {portfolioOpen && (
            <div className="mt-1.5 space-y-1.5">
              {portfolioTabs.map(({ key, label, Icon }) => {
                const isActive = isPortfolioActive && activeTab === key;
                return (
                  <Link
                    key={key}
                    href={`/admin/portfolio?tab=${key}`}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ease-out border ${
                      isActive
                        ? `${tabActiveStyles[key].replace("border ", "")} font-medium`
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04] hover:translate-x-1"
                    }`}
                  >
                    <Icon />
                    {label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Project Management */}
        <div>
          <button
            onClick={() => setPMOpen((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-1.5 group cursor-pointer"
          >
            <span className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold group-hover:text-gray-400 transition-colors">
              Project Management
            </span>
            <ChevronIcon open={pmOpen} />
          </button>

          {pmOpen && (
            <div className="mt-1.5 space-y-1.5">
              {/* All Projects */}
              <Link
                href="/admin/pm"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ease-out border ${
                  pathname === "/admin/pm"
                    ? "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-200 border-indigo-500/20 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md font-medium"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04] hover:translate-x-1"
                }`}
              >
                <IconPM />
                All Projects
              </Link>

              {/* Dynamic PM project list */}
              {pmLoading ? (
                <div className="px-3 py-2">
                  <div className="h-4 w-32 rounded bg-white/[0.04] animate-pulse" />
                </div>
              ) : (
                pmProjects.map((proj) => {
                  const isActive = pathname === `/admin/pm/${proj._id}`;
                  return (
                    <Link
                      key={proj._id}
                      href={`/admin/pm/${proj._id}`}
                      className={`w-full flex items-center gap-3 px-3 pl-6 py-2 rounded-xl text-sm transition-all duration-300 ease-out border ${
                        isActive
                          ? "bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-200 border-violet-500/20 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md font-medium"
                          : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.03] hover:translate-x-1"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/40 shrink-0" />
                      <span className="truncate">{proj.title}</span>
                    </Link>
                  );
                })
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ── Logout ────────────────────────────────────── */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/[0.06] hover:translate-x-1 transition-all duration-300 ease-out cursor-pointer mt-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
        Sign Out
      </button>
    </aside>
    </>
  );
}
