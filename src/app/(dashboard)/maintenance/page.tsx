"use client";

import { useEffect, useState } from "react";
import { ModuleCrudPage, StatusBadge } from "@/components/modules/ModuleCrudPage";
import { moduleBreadcrumbs, MODULE_REGISTRY } from "@/lib/navigation";
import { SERVICE_STATUSES, SERVICE_TYPES } from "@/types/modules/constants";

const mod = MODULE_REGISTRY.maintenance;

type Service = { _id: string; title: string; serviceType: string; status: string; renewalDate?: string };

export default function MaintenancePage() {
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
    <ModuleCrudPage<Service>
      title={mod.title}
      subtitle="Maintenance requests and monthly services"
      apiPath={mod.api}
      breadcrumbs={moduleBreadcrumbs(mod.route)}
      getRowId={(r) => r._id}
      statusOptions={[{ value: "All", label: "All" }, ...SERVICE_STATUSES.map((s) => ({ value: s, label: s }))]}
      fields={[
        { key: "clientId", label: "Customer", type: "select", options: clients, required: true },
        { key: "projectId", label: "Project", type: "select", options: projects },
        { key: "title", label: "Title", required: true },
        { key: "serviceType", label: "Type", type: "select", options: SERVICE_TYPES.map((t) => ({ value: t, label: t })) },
        { key: "status", label: "Status", type: "select", options: SERVICE_STATUSES.map((s) => ({ value: s, label: s })) },
        { key: "startDate", label: "Start Date", type: "date" },
        { key: "expiryDate", label: "Expiry Date", type: "date" },
        { key: "renewalDate", label: "Renewal Date", type: "date" },
        { key: "description", label: "Description", type: "textarea" },
      ]}
      columns={[
        { key: "title", label: "Service" },
        { key: "serviceType", label: "Type" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        { key: "renewalDate", label: "Renewal", render: (r) => r.renewalDate ? new Date(r.renewalDate).toLocaleDateString() : "—" },
      ]}
    />
  );
}
