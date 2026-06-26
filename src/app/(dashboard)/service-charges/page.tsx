"use client";

import { ModuleCrudPage } from "@/components/modules/ModuleCrudPage";
import { moduleBreadcrumbs, MODULE_REGISTRY } from "@/lib/navigation";
import { CHARGE_TYPES } from "@/types/modules/constants";

const mod = MODULE_REGISTRY.serviceCharges;

type Charge = { _id: string; chargeType: string; amount: number; totalAmount: number; frequency: string };

export default function ServiceChargesPage() {
  return (
    <ModuleCrudPage<Charge>
      title={mod.title}
      subtitle="Activation, support, monthly and custom charges"
      apiPath={mod.api}
      breadcrumbs={moduleBreadcrumbs(mod.route)}
      getRowId={(r) => r._id}
      fields={[
        { key: "chargeType", label: "Charge Type", type: "select", options: CHARGE_TYPES.map((c) => ({ value: c, label: c })), required: true },
        { key: "amount", label: "Amount", type: "number", required: true },
        { key: "gstPercent", label: "GST %", type: "number" },
        { key: "discount", label: "Discount", type: "number" },
        { key: "frequency", label: "Frequency", type: "select", options: [{ value: "One Time", label: "One Time" }, { value: "Monthly", label: "Monthly" }, { value: "Yearly", label: "Yearly" }] },
        { key: "description", label: "Description", type: "textarea" },
      ]}
      columns={[
        { key: "chargeType", label: "Type" },
        { key: "amount", label: "Amount", render: (r) => `₹${r.amount.toLocaleString()}` },
        { key: "totalAmount", label: "Total", render: (r) => `₹${(r.totalAmount || 0).toLocaleString()}` },
        { key: "frequency", label: "Frequency" },
      ]}
    />
  );
}
