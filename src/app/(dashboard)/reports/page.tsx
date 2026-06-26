"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/modules/Breadcrumb";
import { PageShell, btnPrimary } from "@/components/modules/DataTable";
import { moduleBreadcrumbs, MODULE_REGISTRY } from "@/lib/navigation";
import toast from "react-hot-toast";

const mod = MODULE_REGISTRY.reports;

const REPORT_TYPES = [
  { id: "staff", label: "Staff" },
  { id: "customer", label: "Customer" },
  { id: "sales", label: "Sales" },
  { id: "projects", label: "Projects" },
  { id: "expense", label: "Expense" },
  { id: "salary", label: "Salary" },
  { id: "assets", label: "Assets" },
  { id: "renewals", label: "Renewals" },
  { id: "payments", label: "Payments" },
  { id: "payment-ledger", label: "Payment Ledger" },
  { id: "maintenance", label: "Maintenance" },
  { id: "allocations", label: "Staff Allocation" },
];

export default function ReportsPage() {
  const [type, setType] = useState("customer");
  const [preview, setPreview] = useState<{ count: number; items: unknown[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async (format: "json" | "csv") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?type=${type}&format=${format}`);
      if (format === "csv") {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}-report.csv`;
        a.click();
        toast.success("CSV downloaded");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPreview(data);
      toast.success(`Report generated: ${data.count} records`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Report failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title={mod.title}
      subtitle="Generate and export reports"
      breadcrumbs={<Breadcrumb items={moduleBreadcrumbs(mod.route)} />}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Report Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="mb-4 w-full max-w-md rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800">
          {REPORT_TYPES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={loading} onClick={() => generate("json")} className={btnPrimary}>Preview</button>
          <button type="button" disabled={loading} onClick={() => generate("csv")} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-600">Export CSV</button>
        </div>
      </div>
      {preview && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-400">{preview.count} records</p>
          <pre className="max-h-96 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-200">{JSON.stringify(preview.items.slice(0, 10), null, 2)}</pre>
        </div>
      )}
    </PageShell>
  );
}
