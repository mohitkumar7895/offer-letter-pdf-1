  "use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  UserCheck, 
  ArrowRight, 
  Search,
  LayoutGrid,
  Info,
  Plus,
  Minus
} from "lucide-react";
import type { Employee } from "@/types/employee";
import { FormSkeleton } from "@/components/SkeletonLoader";

type Manager = {
  id: string;
  name: string;
  role: string;
  email: string;
  mobileNumber?: string;
};

type ManagerResponse = { items?: Manager[]; warning?: string; error?: string };
type EmployeeResponse = { items?: Employee[]; warning?: string; error?: string };

export default function TeamLeaderManagementPage() {
  const router = useRouter();
  const [managers, setManagers] = useState<Manager[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTl, setSelectedTl] = useState(""
  );
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [expandedTlId, setExpandedTlId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [managersRes, employeesRes] = await Promise.all([
        fetch("/api/employees/managers", { cache: "no-store" }),
        fetch("/api/employees", { cache: "no-store" }),
      ]);

      if (managersRes.status === 401 || employeesRes.status === 401) {
        router.replace("/login");
        return;
      }

      const managersData = (await managersRes.json()) as ManagerResponse;
      const employeesData = (await employeesRes.json()) as EmployeeResponse;

      if (!managersRes.ok) {
        throw new Error(managersData.error || managersData.warning || "Failed to load TLs");
      }
      if (!employeesRes.ok) {
        throw new Error(employeesData.error || employeesData.warning || "Failed to load employees");
      }

      setManagers(
        (managersData.items || []).filter((item) => item.role === "TL"),
      );
      setEmployees((employeesData.items || []).filter((item) => item.accessRole === "Employee"));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load TL management data");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectedTlName = useMemo(
    () => managers.find((m) => m.id === selectedTl)?.name || "",
    [managers, selectedTl],
  );

  const membersByTlId = useMemo(() => {
    const grouped: Record<string, Employee[]> = {};
    for (const employee of employees) {
      const tlId = employee.reportingTL?.id;
      if (!tlId) continue;
      if (!grouped[tlId]) grouped[tlId] = [];
      grouped[tlId].push(employee);
    }
    return grouped;
  }, [employees]);

  const toggleEmployeeSelection = useCallback((employeeId: string) => {
    setSelectedEmployeeIds((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId],
    );
  }, []);

  const availableEmployees = useMemo(() => {
    if (!selectedTl) {
      return employees;
    }
    return employees;
  }, [employees, selectedTl]);

  async function handleCreateTl(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setMessage(null);

    try {
      const res = await fetch("/api/tls/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to create TL account");
        return;
      }

      setName("");
      setEmail("");
      setPassword("");
      setMessage("Team Leader account created successfully.");
      await loadData();
    } catch {
      setMessage("Unable to create Team Leader account.");
    } finally {
      setCreating(false);
    }
  }

  async function handleAssign() {
    if (!selectedTl || selectedEmployeeIds.length === 0) return;
    setAssigning(true);
    setMessage(null);

    try {
      const res = await fetch("/api/tls/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tlId: selectedTl, employeeIds: selectedEmployeeIds }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to assign employees");
        return;
      }

      setSelectedEmployeeIds([]);
      setMessage(`Assigned ${selectedEmployeeIds.length} employee(s) to ${selectedTlName}.`);
      await loadData();
    } catch {
      setMessage("Unable to assign employees to TL.");
    } finally {
      setAssigning(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 transition-colors duration-500 dark:bg-slate-950/50 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <header className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white/70 p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-2xl dark:border-slate-800/50 dark:bg-slate-900/70 dark:shadow-none sm:p-10">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(14,165,233,0.1),transparent_40%),radial-gradient(circle_at_100%_100%,rgba(99,102,241,0.1),transparent_40%)]"
            aria-hidden
          />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300">
                <Shield className="size-3" />
                Team Infrastructure
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                TL Management
              </h1>
              <p className="max-w-2xl text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                Orchestrate your team hierarchy. Assign members to Team Leaders and maintain a transparent, organized structure for your entire organization.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-3xl bg-slate-900 px-6 py-4 text-white shadow-xl shadow-slate-900/20 dark:bg-white dark:text-slate-900">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Total TLs</p>
                <p className="mt-1 text-3xl font-black tabular-nums">{managers.length}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Feedback Messages */}
        {message && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-4 rounded-3xl border border-cyan-100 bg-cyan-50/50 p-4 text-sm font-semibold text-cyan-900 backdrop-blur-xl dark:border-cyan-900/30 dark:bg-cyan-950/30 dark:text-cyan-200">
            <Info className="size-5 shrink-0" />
            {message}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-4 rounded-3xl border border-red-100 bg-red-50/50 p-4 text-sm font-semibold text-red-900 backdrop-blur-xl dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-300">
            <Info className="size-5 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          {/* Left Column: Assignment Tool */}
          <section className="h-fit sticky top-8 space-y-6">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/80 dark:shadow-none">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-500/30">
                  <UserPlus className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Assign Members</h2>
                  <p className="text-xs font-medium text-slate-500">Distribute team members</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Target Team Leader
                  </label>
                  <div className="relative group">
                    <select
                      value={selectedTl}
                      onChange={(e) => setSelectedTl(e.target.value)}
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    >
                      <option value="">— Choose a TL —</option>
                      {managers.map((manager) => (
                        <option key={manager.id} value={manager.id}>
                          {manager.name} ({manager.role})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Unassigned Employees
                    </label>
                    <span className="text-[10px] font-bold text-slate-400">
                      {selectedEmployeeIds.length} Selected
                    </span>
                  </div>
                  <div className="h-72 overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50/30 p-3 space-y-2 dark:border-slate-800 dark:bg-slate-950/50 custom-scrollbar">
                    {loading ? (
                      <FormSkeleton rows={3} />
                    ) : availableEmployees.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full py-6 text-center">
                        <Users className="size-8 text-slate-300 dark:text-slate-700 mb-2" />
                        <p className="text-xs font-medium text-slate-400">No unassigned members found</p>
                      </div>
                    ) : (
                      availableEmployees.map((employee) => {
                        const isSelected = selectedEmployeeIds.includes(employee._id);
                        return (
                          <button
                            key={employee._id}
                            onClick={() => toggleEmployeeSelection(employee._id)}
                            className={`flex w-full items-center gap-3 rounded-2xl border p-3 transition-all text-left group ${
                              isSelected 
                                ? "border-cyan-500 bg-cyan-50/50 shadow-md shadow-cyan-500/10 dark:bg-cyan-500/10" 
                                : "border-transparent bg-white hover:border-slate-200 dark:bg-slate-900 dark:hover:border-slate-700"
                            }`}
                          >
                            <div className={`size-4 rounded-full border-2 transition-all flex items-center justify-center ${
                              isSelected ? "bg-cyan-500 border-cyan-500" : "border-slate-300 dark:border-slate-700 group-hover:border-cyan-400"
                            }`}>
                              {isSelected && <div className="size-1.5 rounded-full bg-white" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-bold text-slate-900 dark:text-white">{employee.employeeName}</p>
                              <p className="truncate text-[10px] text-slate-500">{employee.designation}</p>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAssign}
                  disabled={!selectedTl || selectedEmployeeIds.length === 0 || assigning}
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-cyan-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-cyan-600/20 transition-all hover:bg-cyan-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:shadow-none dark:disabled:bg-slate-800"
                >
                  <div className="relative z-10 flex items-center gap-2">
                    {assigning ? (
                      <div className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <UserCheck className="size-4" />
                        <span>Confirm Assignment</span>
                      </>
                    )}
                  </div>
                  {!assigning && (
                    <ArrowRight className="absolute right-4 size-4 translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-30" />
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Right Column: Active TL Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                  <LayoutGrid className="size-5" />
                </div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Active Hierarchy</h2>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-40 animate-pulse rounded-[2rem] bg-slate-100 dark:bg-slate-900" />
                  ))}
                </div>
              ) : managers.length === 0 ? (
                <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 p-20 text-center dark:border-slate-800">
                  <Search className="mx-auto size-12 text-slate-300 dark:text-slate-700" />
                  <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No Team Leaders active</h3>
                  <p className="mt-2 text-sm text-slate-500">Configure TL accounts in the employee management section first.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {managers.map((manager) => {
                    const isExpanded = expandedTlId === manager.id;
                    const members = membersByTlId[manager.id] || [];

                    return (
                      <div 
                        key={manager.id} 
                        className={`group relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 ${
                          isExpanded 
                            ? "border-indigo-500 bg-white shadow-2xl dark:border-indigo-400 dark:bg-slate-900" 
                            : "border-slate-200/60 bg-white/50 hover:border-indigo-300 hover:bg-white dark:border-slate-800/60 dark:bg-slate-900/40 dark:hover:bg-slate-800/60 dark:hover:border-indigo-500/30"
                        }`}
                      >
                        <div className="p-6 sm:p-8">
                          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                              <div className="flex size-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl font-black text-white shadow-xl shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-500">
                                {manager.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-xl bg-white p-1 shadow-md dark:bg-slate-800">
                                <div className="size-full rounded-lg bg-emerald-500" />
                              </div>
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1 space-y-2">
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="truncate text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                  {manager.name}
                                </h3>
                                <span className="rounded-lg bg-indigo-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                                  {manager.role}
                                </span>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-semibold text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                  <div className="flex size-6 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
                                    <Mail className="size-3.5 text-indigo-500" />
                                  </div>
                                  <span className="truncate">{manager.email}</span>
                                </div>
                                {manager.mobileNumber && (
                                  <div className="flex items-center gap-2 border-l border-slate-200 pl-6 dark:border-slate-800">
                                    <div className="flex size-6 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
                                      <Phone className="size-3.5 text-indigo-500" />
                                    </div>
                                    <span>{manager.mobileNumber}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 border-l border-slate-200 pl-6 dark:border-slate-800">
                                  <div className="flex size-6 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
                                    <Shield className="size-3.5 text-indigo-500" />
                                  </div>
                                  <span>{manager.role} Authority</span>
                                </div>
                              </div>
                            </div>

                            {/* Stats & Toggle */}
                            <div className="flex items-center justify-end">
                              <button
                                onClick={() =>
                                  setExpandedTlId(isExpanded ? null : manager.id)
                                }
                                className={`flex size-10 items-center justify-center rounded-xl text-sm font-black transition-all ${
                                  isExpanded 
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                                    : "bg-slate-100 text-slate-600 hover:bg-indigo-500 hover:text-white dark:bg-slate-800 dark:text-slate-300"
                                }`}
                              >
                                {isExpanded ? (
                                  <Minus className="size-5" />
                                ) : (
                                  <Plus className="size-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Member List */}
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                          <div className="border-t border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-950/20 sm:p-8">
                            <div className="grid gap-3 sm:grid-cols-2">
                              {members.length === 0 ? (
                                <div className="col-span-full py-4 text-center">
                                  <p className="text-xs font-bold italic text-slate-400">No team members assigned under this TL.</p>
                                </div>
                              ) : (
                                members.map((member) => (
                                  <div 
                                    key={member._id} 
                                    className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md hover:ring-indigo-500/20 dark:bg-slate-900 dark:ring-slate-800"
                                  >
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-black">
                                      {member.employeeName.charAt(0)}
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-1.5">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <p className="truncate text-sm font-black text-slate-900 dark:text-white">{member.employeeName}</p>
                                        <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                          {member.designation}
                                        </span>
                                      </div>
                                      
                                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                          <Mail className="size-3 text-indigo-500" />
                                          <span className="truncate">{member.email}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <Phone className="size-3 text-indigo-500" />
                                          <span>{member.mobileNumber}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <Shield className="size-3 text-indigo-500" />
                                          <span>{member.accessRole}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="size-2 shrink-0 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 mt-1.5" />
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
