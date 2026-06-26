"use client";

import { ModuleCrudPage, StatusBadge } from "@/components/modules/ModuleCrudPage";
import { moduleBreadcrumbs, MODULE_REGISTRY } from "@/lib/navigation";
import { PURCHASE_STATUSES } from "@/types/modules/constants";
import toast from "react-hot-toast";

const mod = MODULE_REGISTRY.purchases;

type Purchase = { _id: string; title: string; vendor: string; totalCost: number; status: string };

export default function PurchasesPage() {
  return (
    <ModuleCrudPage<Purchase>
      title={mod.title}
      subtitle="Purchase requests, approvals, and asset creation"
      apiPath={mod.api}
      breadcrumbs={moduleBreadcrumbs(mod.route)}
      getRowId={(r) => r._id}
      statusOptions={[{ value: "All", label: "All" }, ...PURCHASE_STATUSES.map((s) => ({ value: s, label: s }))]}
      fields={[
        { key: "title", label: "Title", required: true },
        { key: "vendor", label: "Vendor", required: true },
        { key: "assetType", label: "Asset Type" },
        { key: "quantity", label: "Quantity", type: "number" },
        { key: "unitCost", label: "Unit Cost", type: "number", required: true },
        { key: "notes", label: "Notes", type: "textarea" },
      ]}
      columns={[
        { key: "title", label: "Request" },
        { key: "vendor", label: "Vendor" },
        { key: "totalCost", label: "Total", render: (r) => `₹${r.totalCost.toLocaleString()}` },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
      extraActions={(row, reload) => (
        <>
          {row.status === "Pending" && (
            <button type="button" className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white" onClick={async () => {
              const res = await fetch(`/api/purchases?id=${row._id}&action=approve`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "Approved" }) });
              if (!res.ok) return toast.error("Failed");
              toast.success("Approved");
              reload();
            }}>Approve</button>
          )}
          {row.status === "Approved" && (
            <button type="button" className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white" onClick={async () => {
              const res = await fetch(`/api/purchases?id=${row._id}&action=create-asset`, { method: "PUT" });
              if (!res.ok) return toast.error("Failed");
              toast.success("Asset created");
              reload();
            }}>Create Asset</button>
          )}
        </>
      )}
    />
  );
}
