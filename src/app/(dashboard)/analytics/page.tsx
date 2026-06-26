"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/modules/Breadcrumb";
import { PageShell } from "@/components/modules/DataTable";
import { moduleBreadcrumbs, MODULE_REGISTRY } from "@/lib/navigation";
import { StatCard, StatCardSkeleton } from "@/components/modules/StatCard";

const mod = MODULE_REGISTRY.analytics;

type DashboardStats = {
  cards: Record<string, number>;
  charts: {
    leadsByStatus: { _id: string; count: number }[];
    projectsByStatus: { _id: string; count: number }[];
    expensesByCategory: { _id: string; total: number }[];
    salaryByMonth: { _id: number; total: number }[];
  };
};

export default function AnalyticsDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/dashboard/stats", { signal: controller.signal })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const c = stats?.cards;

  return (
    <PageShell
      title={mod.title}
      subtitle="Cross-module statistics and charts"
      breadcrumbs={<Breadcrumb items={moduleBreadcrumbs(mod.route)} />}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {!c ? (
          <StatCardSkeleton count={12} />
        ) : (
          <>
            <StatCard title="Total Staff" value={c.totalStaff ?? 0} icon="Users" color="blue" />
            <StatCard title="Total Customers" value={c.totalCustomers ?? 0} icon="UserCircle" color="green" />
            <StatCard title="Active Projects" value={c.activeProjects ?? 0} icon="Briefcase" color="indigo" />
            <StatCard title="Completed Projects" value={c.completedProjects ?? 0} icon="Shield" color="green" />
            <StatCard title="Monthly Revenue" value={`₹${(c.monthlyRevenue || 0).toLocaleString()}`} icon="CreditCard" color="green" />
            <StatCard title="Pending Payments" value={c.pendingPayments ?? 0} icon="Clock" color="red" />
            <StatCard title="Office Expenses" value={`₹${(c.officeExpenses || 0).toLocaleString()}`} icon="FileText" color="orange" />
            <StatCard title="Staff Expenses" value={`₹${(c.staffExpenses || 0).toLocaleString()}`} icon="TrendingUp" color="orange" />
            <StatCard title="Assets" value={c.assets ?? 0} icon="Briefcase" color="blue" />
            <StatCard title="Renewals Due" value={c.renewals ?? 0} icon="Clock" color="red" />
            <StatCard title="Total Leads" value={c.totalLeads ?? 0} icon="Users" color="indigo" />
            <StatCard title="Converted Leads" value={c.convertedLeads ?? 0} icon="Shield" color="green" />
          </>
        )}
      </div>

      {stats?.charts && (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="Leads by Status" data={stats.charts.leadsByStatus} />
          <ChartCard title="Projects by Status" data={stats.charts.projectsByStatus} />
          <ChartCard title="Office Expenses by Category" data={stats.charts.expensesByCategory} valueKey="total" />
          <ChartCard title="Salary by Month" data={stats.charts.salaryByMonth?.map((s) => ({ _id: `Month ${s._id}`, count: s.total }))} valueKey="count" />
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {[
          ["/sales/leads", "Sales"],
          ["/projects", "Projects"],
          ["/payments", "Payments"],
          ["/reports", "Reports"],
          ["/tasks", "Tasks"],
          ["/notifications", "Notifications"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold transition-colors hover:border-cyan-400 dark:border-slate-800 dark:bg-slate-900">{label}</Link>
        ))}
      </div>
    </PageShell>
  );
}

function ChartCard({
  title,
  data,
  valueKey = "count",
}: {
  title: string;
  data?: { _id: string | number; count?: number; total?: number }[];
  valueKey?: string;
}) {
  const items = data || [];
  const max = Math.max(...items.map((d) => (valueKey === "total" ? d.total : d.count) || 0), 1);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 font-bold text-slate-900 dark:text-white">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No data yet</p>
      ) : (
        <div className="space-y-3">
          {items.map((d) => {
            const val = (valueKey === "total" ? d.total : d.count) || 0;
            return (
              <div key={String(d._id)}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{String(d._id)}</span>
                  <span>{val}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-2 rounded-full bg-cyan-500" style={{ width: `${(val / max) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
