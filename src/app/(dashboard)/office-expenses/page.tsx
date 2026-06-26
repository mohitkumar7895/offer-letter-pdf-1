"use client";

import { ModuleCrudPage } from "@/components/modules/ModuleCrudPage";
import { moduleBreadcrumbs, MODULE_REGISTRY } from "@/lib/navigation";
import { OFFICE_EXPENSE_CATEGORIES } from "@/types/modules/constants";

const mod = MODULE_REGISTRY.officeExpenses;

type Expense = { _id: string; title: string; category: string; amount: number; vendor?: string; expenseDate: string };

export default function OfficeExpensesPage() {
  return (
    <ModuleCrudPage<Expense>
      title={mod.title}
      subtitle="Rent, utilities, supplies and misc"
      apiPath={mod.api}
      breadcrumbs={moduleBreadcrumbs(mod.route)}
      getRowId={(r) => r._id}
      fields={[
        { key: "category", label: "Category", type: "select", options: OFFICE_EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c })), required: true },
        { key: "title", label: "Title", required: true },
        { key: "amount", label: "Amount", type: "number", required: true },
        { key: "vendor", label: "Vendor" },
        { key: "expenseDate", label: "Date", type: "date" },
        { key: "description", label: "Description", type: "textarea" },
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "amount", label: "Amount", render: (r) => `₹${r.amount.toLocaleString()}` },
        { key: "vendor", label: "Vendor" },
      ]}
    />
  );
}
