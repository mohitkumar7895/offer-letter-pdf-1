"use client";

import { useEffect, useState } from "react";
import { ModuleCrudPage, StatusBadge } from "@/components/modules/ModuleCrudPage";
import { moduleBreadcrumbs, MODULE_REGISTRY } from "@/lib/navigation";

const mod = MODULE_REGISTRY.domains;

type DomainRow = { _id: string; domainName: string; registrar?: string; expiryDate?: string; status: string };

export default function DomainsPage() {
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
    <ModuleCrudPage<DomainRow>
      title={mod.title}
      subtitle="Track domains, expiry, and renewals"
      apiPath={mod.api}
      breadcrumbs={moduleBreadcrumbs(mod.route)}
      getRowId={(r) => r._id}
      fields={[
        { key: "clientId", label: "Customer", type: "select", options: clients },
        { key: "projectId", label: "Project", type: "select", options: projects },
        { key: "domainName", label: "Domain Name", required: true },
        { key: "registrar", label: "Registrar" },
        { key: "purchaseDate", label: "Purchase Date", type: "date" },
        { key: "expiryDate", label: "Expiry Date", type: "date" },
        { key: "hostingProvider", label: "Hosting Provider" },
        { key: "notes", label: "Notes", type: "textarea" },
      ]}
      columns={[
        { key: "domainName", label: "Domain" },
        { key: "registrar", label: "Registrar" },
        { key: "expiryDate", label: "Expiry", render: (r) => r.expiryDate ? new Date(r.expiryDate).toLocaleDateString() : "—" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
    />
  );
}
