"use client";

import { ModuleCrudPage, StatusBadge } from "@/components/modules/ModuleCrudPage";
import { moduleBreadcrumbs, MODULE_REGISTRY } from "@/lib/navigation";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/types/modules/constants";
import toast from "react-hot-toast";

type Lead = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  source: string;
  status: string;
  expectedValue?: number;
  createdAt: string;
};

const mod = MODULE_REGISTRY.leads;

export default function SalesLeadsPage() {
  return (
    <ModuleCrudPage<Lead>
      title={mod.title}
      subtitle="Manage leads, follow-ups, and convert to customers"
      apiPath={mod.api}
      breadcrumbs={moduleBreadcrumbs(mod.route)}
      getRowId={(r) => r._id}
      statusOptions={[{ value: "All", label: "All Status" }, ...LEAD_STATUSES.map((s) => ({ value: s, label: s }))]}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "phone", label: "Phone", required: true },
        { key: "email", label: "Email" },
        { key: "company", label: "Company" },
        { key: "source", label: "Source", type: "select", options: LEAD_SOURCES.map((s) => ({ value: s, label: s })) },
        { key: "status", label: "Status", type: "select", options: LEAD_STATUSES.map((s) => ({ value: s, label: s })) },
        { key: "expectedValue", label: "Expected Value", type: "number" },
        { key: "notes", label: "Notes", type: "textarea" },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "company", label: "Company" },
        { key: "source", label: "Source" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        { key: "expectedValue", label: "Value", render: (r) => `₹${(r.expectedValue || 0).toLocaleString()}` },
      ]}
      extraActions={(row, reload) =>
        row.status !== "Converted" ? (
          <button
            type="button"
            className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
            onClick={async () => {
              const res = await fetch(`/api/sales/leads/${row._id}?action=convert`, { method: "PUT" });
              const data = await res.json();
              if (!res.ok) return toast.error(data.error || "Convert failed");
              toast.success("Lead converted to customer");
              reload();
            }}
          >
            Convert
          </button>
        ) : null
      }
    />
  );
}
