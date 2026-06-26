"use client";

import { ModuleCrudPage, StatusBadge } from "@/components/modules/ModuleCrudPage";
import { moduleBreadcrumbs, MODULE_REGISTRY } from "@/lib/navigation";
import { ASSET_STATUSES, ASSET_TYPES } from "@/types/modules/constants";

const mod = MODULE_REGISTRY.assets;

type Asset = { _id: string; name: string; assetType: string; serialNumber?: string; status: string; purchaseCost?: number };

export default function AssetsPage() {
  return (
    <ModuleCrudPage<Asset>
      title={mod.title}
      subtitle="Laptops, furniture, vehicles and more"
      apiPath={mod.api}
      breadcrumbs={moduleBreadcrumbs(mod.route)}
      getRowId={(r) => r._id}
      statusOptions={[{ value: "All", label: "All" }, ...ASSET_STATUSES.map((s) => ({ value: s, label: s }))]}
      fields={[
        { key: "assetType", label: "Type", type: "select", options: ASSET_TYPES.map((t) => ({ value: t, label: t })), required: true },
        { key: "name", label: "Name", required: true },
        { key: "serialNumber", label: "Serial Number" },
        { key: "purchaseCost", label: "Purchase Cost", type: "number" },
        { key: "purchaseDate", label: "Purchase Date", type: "date" },
        { key: "warrantyExpiry", label: "Warranty Expiry", type: "date" },
        { key: "status", label: "Status", type: "select", options: ASSET_STATUSES.map((s) => ({ value: s, label: s })) },
      ]}
      columns={[
        { key: "name", label: "Asset" },
        { key: "assetType", label: "Type" },
        { key: "serialNumber", label: "Serial" },
        { key: "purchaseCost", label: "Cost", render: (r) => `₹${(r.purchaseCost || 0).toLocaleString()}` },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
