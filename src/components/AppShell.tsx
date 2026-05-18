"use client";

import { useCallback, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import type { AccessRole } from "@/types/employee";

type Props = {
  initialTheme: "light" | "dark";
  userRole?: AccessRole;
  children: React.ReactNode;
  companyName?: string;
  companyLogo?: string | null;
};

export function AppShell({ initialTheme, userRole, children, companyName, companyLogo }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleCloseMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex min-h-screen">
      <AppSidebar
        initialTheme={initialTheme}
        userRole={userRole}
        mobileOpen={mobileOpen}
        onCloseMobile={handleCloseMobile}
        companyName={companyName}
        companyLogo={companyLogo}
      />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-4 py-2.5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 sm:px-6 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className="size-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={2}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
            <div className="flex flex-1 items-center justify-center">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate max-w-[200px]">
                {companyName || "Employee Management"}
              </span>
            </div>
            <div className="size-10" aria-hidden /> {/* Spacer for balance */}
          </div>
        </header>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
