"use client";

import { ModuleCrudPage, StatusBadge } from "@/components/modules/ModuleCrudPage";
import { moduleBreadcrumbs, MODULE_REGISTRY } from "@/lib/navigation";
import { RENEWAL_STATUSES } from "@/types/modules/constants";

const mod = MODULE_REGISTRY.renewals;

type Renewal = { _id: string; title: string; renewalDate: string; amount: number; paymentStatus: string };

export default function RenewalsPage() {
  return (
    <ModuleCrudPage<Renewal>
      title={mod.title}
      subtitle="Track renewals and payment status"
      apiPath={mod.api}
      breadcrumbs={moduleBreadcrumbs(mod.route)}
      getRowId={(r) => r._id}
      statusOptions={[{ value: "All", label: "All" }, ...RENEWAL_STATUSES.map((s) => ({ value: s, label: s }))]}
      fields={[
        { key: "title", label: "Title", required: true },
        { key: "renewalDate", label: "Renewal Date", type: "date", required: true },
        { key: "amount", label: "Amount", type: "number" },
        { key: "paymentStatus", label: "Status", type: "select", options: RENEWAL_STATUSES.map((s) => ({ value: s, label: s })) },
        { key: "notes", label: "Notes", type: "textarea" },
      ]}
      columns={[
        { key: "title", label: "Renewal" },
        { key: "renewalDate", label: "Date", render: (r) => new Date(r.renewalDate).toLocaleDateString() },
        { key: "amount", label: "Amount", render: (r) => `₹${(r.amount || 0).toLocaleString()}` },
        { key: "paymentStatus", label: "Status", render: (r) => <StatusBadge status={r.paymentStatus} /> },
      ]}
    />
  );
}
