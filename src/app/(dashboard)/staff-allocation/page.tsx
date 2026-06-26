"use client";

import { useEffect, useState } from "react";
import { fetchJsonCached } from "@/lib/clientDataCache";
import { ModuleCrudPage } from "@/components/modules/ModuleCrudPage";
import { moduleBreadcrumbs, MODULE_REGISTRY } from "@/lib/navigation";

const mod = MODULE_REGISTRY.staffAllocation;

type Allocation = {
  _id: string;
  employeeName: string;
  projectName: string;
  role: string;
  allocationPercent: number;
};

export default function StaffAllocationPage() {
  const [employees, setEmployees] = useState<{ value: string; label: string }[]>([]);
  const [projects, setProjects] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetchJsonCached<{ items?: Array<{ _id: string; employeeName: string }> }>("/api/employees?lite=1"),
      fetchJsonCached<{ items?: Array<{ _id: string; name: string }> }>("/api/projects?limit=100"),
    ])
      .then(([ed, pd]) => {
        setEmployees((ed.items || []).map((x) => ({ value: x._id, label: x.employeeName })));
        setProjects((pd.items || []).map((x) => ({ value: x._id, label: x.name })));
      })
      .catch(() => {});
  }, []);

  return (
    <ModuleCrudPage<Allocation>
      title={mod.title}
      subtitle="Assign staff to projects"
      apiPath={mod.api}
      breadcrumbs={moduleBreadcrumbs(mod.route)}
      getRowId={(r) => r._id}
      fields={[
        { key: "employeeId", label: "Employee", type: "select", options: employees, required: true },
        { key: "employeeName", label: "Employee Name", required: true },
        { key: "projectId", label: "Project", type: "select", options: projects, required: true },
        { key: "role", label: "Role" },
        { key: "allocationPercent", label: "Allocation %", type: "number" },
      ]}
      columns={[
        { key: "employeeName", label: "Staff" },
        { key: "projectName", label: "Project" },
        { key: "role", label: "Role" },
        { key: "allocationPercent", label: "%", render: (r) => `${r.allocationPercent}%` },
      ]}
    />
  );
}
