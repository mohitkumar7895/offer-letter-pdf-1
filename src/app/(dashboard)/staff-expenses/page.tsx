"use client";

import { ModuleCrudPage, StatusBadge } from "@/components/modules/ModuleCrudPage";
import { moduleBreadcrumbs, MODULE_REGISTRY } from "@/lib/navigation";
import { EXPENSE_CATEGORIES, EXPENSE_STATUSES } from "@/types/modules/constants";
import toast from "react-hot-toast";

const mod = MODULE_REGISTRY.staffExpenses;

type Expense = { _id: string; employeeName: string; category: string; amount: number; status: string; expenseDate: string };

export default function StaffExpensesPage() {
  return (
    <ModuleCrudPage<Expense>
      title={mod.title}
      subtitle="Travel, food, fuel and other expenses"
      apiPath={mod.api}
      breadcrumbs={moduleBreadcrumbs(mod.route)}
      getRowId={(r) => r._id}
      statusOptions={[{ value: "All", label: "All" }, ...EXPENSE_STATUSES.map((s) => ({ value: s, label: s }))]}
      fields={[
        { key: "employeeId", label: "Employee ID", required: true },
        { key: "employeeName", label: "Employee Name", required: true },
        { key: "category", label: "Category", type: "select", options: EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c })), required: true },
        { key: "amount", label: "Amount", type: "number", required: true },
        { key: "expenseDate", label: "Date", type: "date" },
        { key: "description", label: "Description", type: "textarea" },
      ]}
      columns={[
        { key: "employeeName", label: "Employee" },
        { key: "category", label: "Category" },
        { key: "amount", label: "Amount", render: (r) => `₹${r.amount.toLocaleString()}` },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
      extraActions={(row, reload) =>
        row.status === "Pending" ? (
          <button type="button" className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white" onClick={async () => {
            const res = await fetch(`/api/staff-expenses?id=${row._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "Approved" }) });
            if (!res.ok) return toast.error("Approval failed");
            toast.success("Approved");
            reload();
          }}>Approve</button>
        ) : null
      }
    />
  );
}
