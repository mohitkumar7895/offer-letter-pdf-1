"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ModuleCrudPage, StatusBadge } from "@/components/modules/ModuleCrudPage";
import { moduleBreadcrumbs, MODULE_REGISTRY } from "@/lib/navigation";
import { PAYMENT_STATUSES, PAYMENT_TYPES } from "@/types/modules/constants";
import toast from "react-hot-toast";

const mod = MODULE_REGISTRY.payments;

type Payment = { _id: string; invoiceNumber?: string; paymentType: string; totalAmount: number; paidAmount: number; dueAmount: number; status: string };

export default function PaymentsPage() {
  const [clients, setClients] = useState<{ value: string; label: string }[]>([]);
  const [projects, setProjects] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    Promise.all([fetch("/api/clients"), fetch("/api/projects?limit=100")])
      .then(async ([clientsRes, projectsRes]) => {
        const clientsData = await clientsRes.json();
        const projectsData = await projectsRes.json();
        const clientList = Array.isArray(clientsData) ? clientsData : clientsData.items || [];
        setClients(clientList.map((c: { _id: string; name: string }) => ({ value: c._id, label: c.name })));
        setProjects((projectsData.items || []).map((p: { _id: string; name: string }) => ({ value: p._id, label: p.name })));
      })
      .catch(() => {});
  }, []);

  return (
    <ModuleCrudPage<Payment>
      title={mod.title}
      subtitle="Invoices, receipts, and payment tracking"
      apiPath={mod.api}
      breadcrumbs={moduleBreadcrumbs(mod.route)}
      getRowId={(r) => r._id}
      statusOptions={[{ value: "All", label: "All" }, ...PAYMENT_STATUSES.map((s) => ({ value: s, label: s }))]}
      fields={[
        { key: "clientId", label: "Customer", type: "select", options: clients, required: true },
        { key: "projectId", label: "Project", type: "select", options: projects },
        { key: "invoiceNumber", label: "Invoice #" },
        { key: "paymentType", label: "Type", type: "select", options: PAYMENT_TYPES.map((t) => ({ value: t, label: t })) },
        { key: "totalAmount", label: "Total Amount", type: "number", required: true },
        { key: "paidAmount", label: "Paid Amount", type: "number" },
        { key: "gstPercent", label: "GST %", type: "number" },
        { key: "discount", label: "Discount", type: "number" },
      ]}
      columns={[
        { key: "invoiceNumber", label: "Invoice" },
        { key: "paymentType", label: "Type" },
        { key: "totalAmount", label: "Total", render: (r) => `₹${r.totalAmount.toLocaleString()}` },
        { key: "dueAmount", label: "Due", render: (r) => `₹${r.dueAmount.toLocaleString()}` },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
      extraActions={(row, reload) => (
        <>
          {row.dueAmount > 0 && (
            <button
              type="button"
              className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
              onClick={async () => {
                const amount = window.prompt(`Received amount for ${row.invoiceNumber || "payment"}`, String(row.dueAmount));
                if (!amount) return;
                const value = Number(amount);
                if (!Number.isFinite(value) || value <= 0) {
                  toast.error("Valid amount dalo");
                  return;
                }
                const res = await fetch(`/api/payments?id=${row._id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    amount: value,
                    paymentMode: "Bank Transfer",
                    notes: "Recorded from payments list",
                  }),
                });
                const data = await res.json();
                if (!res.ok) {
                  toast.error(data.error || "Payment record failed");
                  return;
                }
                toast.success("Payment received recorded");
                reload();
              }}
            >
              Record Payment
            </button>
          )}
          <Link
            href="/payment-ledger"
            className="rounded-xl border border-cyan-300 px-3 py-1.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-50 dark:border-cyan-700 dark:text-cyan-300"
          >
            Ledger
          </Link>
        </>
      )}
    />
  );
}
