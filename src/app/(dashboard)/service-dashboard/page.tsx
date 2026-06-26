"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/modules/Breadcrumb";
import { PageShell } from "@/components/modules/DataTable";
import { moduleBreadcrumbs, MODULE_REGISTRY } from "@/lib/navigation";
import { StatCard, StatCardSkeleton } from "@/components/modules/StatCard";

const mod = MODULE_REGISTRY.serviceDashboard;

type Stats = { cards: Record<string, number> };

export default function OperationsDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

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
      subtitle="Service operations overview"
      breadcrumbs={<Breadcrumb items={moduleBreadcrumbs(mod.route)} />}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {!c ? (
          <StatCardSkeleton count={8} />
        ) : (
          <>
            <StatCard title="Total Customers" value={c.totalCustomers ?? 0} icon="Users" color="blue" />
            <StatCard title="Active Customers" value={c.activeCustomers ?? 0} icon="UserCircle" color="green" />
            <StatCard title="Maintenance Customers" value={c.maintenanceCustomers ?? 0} icon="Briefcase" color="orange" />
            <StatCard title="Monthly Services" value={c.monthlyServices ?? 0} icon="Clock" color="indigo" />
            <StatCard title="Pending Tasks" value={c.pendingTasks ?? 0} icon="FileText" color="orange" />
            <StatCard title="Upcoming Renewals" value={c.upcomingRenewals ?? 0} icon="TrendingUp" color="red" />
            <StatCard title="Pending Payments" value={c.pendingPayments ?? 0} icon="CreditCard" color="red" />
            <StatCard title="Domain Expiry (30d)" value={c.domainExpiry ?? 0} icon="Shield" color="orange" />
          </>
        )}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link href="/maintenance" className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-cyan-400 dark:border-slate-800 dark:bg-slate-900">Maintenance →</Link>
        <Link href="/renewals" className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-cyan-400 dark:border-slate-800 dark:bg-slate-900">Renewals →</Link>
        <Link href="/domains" className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-cyan-400 dark:border-slate-800 dark:bg-slate-900">Domains →</Link>
      </div>
    </PageShell>
  );
}
