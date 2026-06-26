"use client";

import { useEffect, useState } from "react";
import { fetchJsonCached, getCachedJson } from "@/lib/clientDataCache";
import { DashboardClient } from "@/components/DashboardClient";
import type { DashboardItem } from "@/lib/dashboardTypes";
import { TableSkeleton } from "@/components/SkeletonLoader";

type HomeData = {
  items: DashboardItem[];
  error: string | null;
  employeeTotal: number;
  roleCounts: { Admin: number; Employee: number; TL: number; HR: number };
  recentEmployees: Array<{ id: string; name: string; role: string; designation: string }>;
};

export default function DashboardPage() {
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    const cached = getCachedJson<HomeData>("/api/dashboard/home");
    if (cached) setData(cached);

    fetchJsonCached<HomeData>("/api/dashboard/home")
      .then(setData)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex-1 px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-7 xl:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
        <header className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
              Overview
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Letters, employee stats, and recent activity in one place.
            </p>
          </div>
        </header>

        {!data ? (
          <TableSkeleton columns={4} rows={6} />
        ) : (
          <DashboardClient
            initialItems={data.items}
            serverError={data.error}
            employeeTotal={data.employeeTotal}
            roleCounts={data.roleCounts}
            recentEmployees={data.recentEmployees}
          />
        )}
      </div>
    </div>
  );
}
