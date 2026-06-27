"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchJsonCached, getCachedJson, invalidateCachedUrl } from "@/lib/clientDataCache";
import { Breadcrumb } from "@/components/modules/Breadcrumb";
import { StatusBadge, btnPrimary, btnSecondary, formInput, formSelect, formTextarea } from "@/components/modules/DataTable";

type TaskRow = {
  _id: string;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  progress?: number;
  dueDate?: string;
  employeeRemark?: string;
  estimatedTime?: string;
  actualTime?: string;
};

const statusOptions = ["Pending", "In Progress", "Completed"];

export default function EmployeeDashboardPage() {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [onlineSeconds, setOnlineSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TaskRow | null>(null);
  const [form, setForm] = useState({
    status: "In Progress",
    progress: "50",
    employeeRemark: "",
    estimatedTime: "",
    actualTime: "",
  });

  const loadTasks = useCallback(async () => {
    const url = "/api/tasks?limit=100";
    const cached = getCachedJson<{ items?: TaskRow[] }>(url);
    if (cached?.items) {
      setTasks(cached.items);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const data = await fetchJsonCached<{ items?: TaskRow[] }>(url);
      setTasks(data.items || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOnline = useCallback(async () => {
    try {
      const data = await fetchJsonCached<{ totalSeconds?: number }>("/api/auth/online-today");
      setOnlineSeconds(data.totalSeconds || 0);
    } catch {
      // ignore background refresh errors
    }
  }, []);

  useEffect(() => {
    loadTasks();
    loadOnline();
    const onlineInterval = window.setInterval(loadOnline, 60_000);
    return () => window.clearInterval(onlineInterval);
  }, [loadTasks, loadOnline]);

  function openUpdate(task: TaskRow) {
    setEditing(task);
    setForm({
      status: task.status || "In Progress",
      progress: String(task.progress ?? 50),
      employeeRemark: task.employeeRemark || "",
      estimatedTime: task.estimatedTime || "",
      actualTime: task.actualTime || "",
    });
  }

  async function saveUpdate() {
    if (!editing) return;
    const res = await fetch(`/api/tasks?id=${editing._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: form.status,
        progress: Number(form.progress || 0),
        employeeRemark: form.employeeRemark,
        estimatedTime: form.estimatedTime,
        actualTime: form.actualTime,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Update failed");
      return;
    }
    toast.success("Task updated");
    setEditing(null);
    invalidateCachedUrl("/api/tasks");
    loadTasks();
  }

  const pending = tasks.filter((task) => task.status !== "Completed").length;
  const completed = tasks.filter((task) => task.status === "Completed").length;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/employee-dashboard" }, { label: "My Dashboard" }]} />

        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
            Employee Portal
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">My Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Tasks assigned by Admin or TL appear here. You can update status, remarks, and time.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-4">
          <StatCard label="Total Tasks" value={tasks.length} />
          <StatCard label="Pending / Progress" value={pending} />
          <StatCard label="Completed" value={completed} />
          <StatCard label="Today Online" value={formatDuration(onlineSeconds)} />
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-bold text-slate-900 dark:text-white">No task assigned</h2>
            <p className="mt-1 text-sm text-slate-500">When Admin or TL assigns a task, it will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {tasks.map((task) => (
              <article key={task._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">{task.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{task.description || "No description"}</p>
                  </div>
                  <StatusBadge status={task.status || "Pending"} />
                </div>
                <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                  <p>Priority: <span className="font-semibold">{task.priority || "Medium"}</span></p>
                  <p>Progress: <span className="font-semibold">{task.progress || 0}%</span></p>
                  <p>Due: <span className="font-semibold">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</span></p>
                  <p>ETA: <span className="font-semibold">{task.estimatedTime || "Not added"}</span></p>
                </div>
                {task.employeeRemark ? (
                  <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-950/50 dark:text-slate-300">
                    {task.employeeRemark}
                  </p>
                ) : null}
                <button type="button" onClick={() => openUpdate(task)} className={`${btnPrimary} mt-4`}>
                  Update Task
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Update Task</h2>
            <p className="mt-1 text-sm text-slate-500">{editing.title}</p>
            <div className="mt-5 space-y-4">
              <select className={formSelect} value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <input className={formInput} type="number" min="0" max="100" value={form.progress} onChange={(e) => setForm((p) => ({ ...p, progress: e.target.value }))} placeholder="Progress %" />
              <input className={formInput} value={form.estimatedTime} onChange={(e) => setForm((p) => ({ ...p, estimatedTime: e.target.value }))} placeholder="Estimated time, e.g. 2 hours / 1 day" />
              <input className={formInput} value={form.actualTime} onChange={(e) => setForm((p) => ({ ...p, actualTime: e.target.value }))} placeholder="Actual time spent" />
              <textarea className={formTextarea} value={form.employeeRemark} onChange={(e) => setForm((p) => ({ ...p, employeeRemark: e.target.value }))} placeholder="Remark / progress note" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className={btnSecondary}>Cancel</button>
              <button type="button" onClick={saveUpdate} className={btnPrimary}>Save Update</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m`;
  return `${seconds}s`;
}
