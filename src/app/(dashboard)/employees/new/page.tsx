"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmployeeForm } from "@/components/EmployeeForm";
import type { EmployeeFormValues } from "@/lib/employeeSchema";
import toast from "react-hot-toast";

export default function NewEmployeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(payload: { values: EmployeeFormValues; files: FormData }) {
    setLoading(true);

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        body: payload.files,
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        toast.error(data.error || "Failed to create employee");
        return;
      }

      toast.success("Employee created successfully");
      router.push("/employees");
      router.refresh();
    } catch {
      toast.error("Failed to create employee");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
            Employee Management
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Add Employee</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Fill professional profile, account details, and required documents.
          </p>
        </header>
        <EmployeeForm mode="create" loading={loading} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
