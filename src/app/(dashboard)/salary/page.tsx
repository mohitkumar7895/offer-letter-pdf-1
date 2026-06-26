"use client";

import { ModuleCrudPage, StatusBadge } from "@/components/modules/ModuleCrudPage";
import { moduleBreadcrumbs, MODULE_REGISTRY } from "@/lib/navigation";
import { SALARY_STATUSES } from "@/types/modules/constants";

const mod = MODULE_REGISTRY.salary;

type Salary = { _id: string; employeeName: string; month: number; year: number; netSalary: number; status: string };

export default function SalaryPage() {
  const months = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));
  return (
    <ModuleCrudPage<Salary>
      title={mod.title}
      subtitle="Salary, bonus, incentive, and deductions"
      apiPath={mod.api}
      breadcrumbs={moduleBreadcrumbs(mod.route)}
      getRowId={(r) => r._id}
      statusOptions={[{ value: "All", label: "All" }, ...SALARY_STATUSES.map((s) => ({ value: s, label: s }))]}
      fields={[
        { key: "employeeId", label: "Employee ID", required: true },
        { key: "employeeName", label: "Employee Name", required: true },
        { key: "month", label: "Month", type: "select", options: months, required: true },
        { key: "year", label: "Year", type: "number", required: true },
        { key: "baseSalary", label: "Base Salary", type: "number" },
        { key: "bonus", label: "Bonus", type: "number" },
        { key: "incentive", label: "Incentive", type: "number" },
        { key: "deduction", label: "Deduction", type: "number" },
        { key: "advanceSalary", label: "Advance", type: "number" },
      ]}
      defaultForm={{ year: String(new Date().getFullYear()) }}
      columns={[
        { key: "employeeName", label: "Employee" },
        { key: "month", label: "Period", render: (r) => `${r.month}/${r.year}` },
        { key: "netSalary", label: "Net Salary", render: (r) => `₹${(r.netSalary || 0).toLocaleString()}` },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
