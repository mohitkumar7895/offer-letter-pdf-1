"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Breadcrumb } from "@/components/modules/Breadcrumb";
import {
  DataTable,
  PageShell,
  SearchFilterBar,
  StatusBadge,
  btnPrimary,
  btnSecondary,
  formInput,
  formSelect,
  formTextarea,
  type Column,
} from "@/components/modules/DataTable";
import {
  FormActions,
  FormField,
  FormModal,
} from "@/components/ui/FormUi";
import { ConfirmDialog } from "@/components/modules/ConfirmDialog";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";

const moduleDataCache = new Map<
  string,
  {
    items: Record<string, unknown>[];
    pagination: { page: number; totalPages: number; total: number };
    fetchedAt: number;
  }
>();

const MODULE_CACHE_TTL_MS = 60_000;

export type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "textarea";
  options?: { value: string; label: string }[];
  required?: boolean;
};

type Props<T extends Record<string, unknown>> = {
  title: string;
  subtitle?: string;
  apiPath: string;
  breadcrumbs: { label: string; href?: string }[];
  columns: Column<T>[];
  fields: FieldConfig[];
  statusOptions?: { value: string; label: string }[];
  getRowId: (row: T) => string;
  defaultForm?: Record<string, string>;
  canCreate?: boolean;
  extraActions?: (row: T, reload: () => void) => React.ReactNode;
};

export function ModuleCrudPage<T extends Record<string, unknown>>({
  title,
  subtitle,
  apiPath,
  breadcrumbs,
  columns,
  fields,
  statusOptions,
  getRowId,
  defaultForm = {},
  canCreate = true,
  extraActions,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 250);
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, string>>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isFirstLoadRef = useRef(true);

  const load = useCallback(
    async (opts?: { silent?: boolean }) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        search: debouncedSearch,
      });
      if (status !== "All") params.set("status", status);
      const requestUrl = `${apiPath}?${params}`;
      const cached = moduleDataCache.get(requestUrl);

      if (cached && Date.now() - cached.fetchedAt < MODULE_CACHE_TTL_MS) {
        setItems(cached.items as T[]);
        setPagination(cached.pagination);
        setInitialLoad(false);
        isFirstLoadRef.current = false;
      }

      const silent = opts?.silent ?? (Boolean(cached) || !isFirstLoadRef.current);
      if (!silent) {
        setInitialLoad(true);
      } else {
        setRefreshing(true);
      }

      try {
        const res = await fetch(requestUrl, {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");
        const nextItems = data.items || [];
        const nextPagination = data.pagination || { page: 1, totalPages: 1, total: 0 };
        setItems(nextItems);
        setPagination(nextPagination);
        moduleDataCache.set(requestUrl, {
          items: nextItems,
          pagination: nextPagination,
          fetchedAt: Date.now(),
        });
      } catch (err) {
        if (controller.signal.aborted) return;
        toast.error(err instanceof Error ? err.message : "Load failed");
      } finally {
        if (!controller.signal.aborted) {
          isFirstLoadRef.current = false;
          setInitialLoad(false);
          setRefreshing(false);
        }
      }
    },
    [apiPath, page, debouncedSearch, status],
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  useEffect(() => {
    load({ silent: !isFirstLoadRef.current });
    return () => abortRef.current?.abort();
  }, [load]);

  const reload = useCallback(() => {
    load({ silent: true });
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (row: T) => {
    setEditing(row);
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      const val = row[f.key];
      next[f.key] =
        val != null
          ? String(val).slice(0, 10).includes("T") && f.type === "date"
            ? String(val).slice(0, 10)
            : String(val)
          : "";
    });
    setForm(next);
    setModalOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      fields.forEach((f) => {
        if (form[f.key] !== undefined && form[f.key] !== "") {
          payload[f.key] = f.type === "number" ? Number(form[f.key]) : form[f.key];
        }
      });
      const url = editing ? `${apiPath}/${getRowId(editing)}` : apiPath;
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      toast.success(editing ? "Updated" : "Created");
      setModalOpen(false);
      clearModuleCache(apiPath);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${apiPath}/${getRowId(deleteTarget)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Deleted");
      setDeleteTarget(null);
      clearModuleCache(apiPath);
      reload();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <PageShell
      title={title}
      subtitle={subtitle}
      breadcrumbs={<Breadcrumb items={breadcrumbs} />}
      action={
        canCreate ? (
          <button type="button" onClick={openCreate} className={btnPrimary}>
            + Add New
          </button>
        ) : undefined
      }
    >
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        statusOptions={statusOptions}
        onRefresh={reload}
        refreshing={refreshing}
      />
      <DataTable
        columns={columns}
        data={items}
        loading={initialLoad}
        rowKey={getRowId}
        pagination={{
          page: pagination.page,
          totalPages: pagination.totalPages,
          total: pagination.total,
          onPageChange: setPage,
        }}
        actions={(row) => (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => openEdit(row)} className={btnSecondary}>
              Edit
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(row)}
              className="rounded-xl border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-600"
            >
              Delete
            </button>
            {extraActions?.(row, reload)}
          </div>
        )}
      />

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${editing ? "Edit" : "Create"} ${title}`}
        subtitle={subtitle}
        size="lg"
        footer={
          <FormActions
            onCancel={() => setModalOpen(false)}
            onSubmit={save}
            loading={saving}
            submitLabel={editing ? "Update" : "Create"}
          />
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => {
            const fullWidth = field.type === "textarea";
            return (
              <FormField
                key={field.key}
                label={field.label}
                required={field.required}
                className={fullWidth ? "sm:col-span-2" : ""}
              >
                {field.type === "select" ? (
                  <select
                    className={formSelect}
                    value={form[field.key] || ""}
                    onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                  >
                    <option value="">Select…</option>
                    {field.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    className={formTextarea}
                    rows={3}
                    value={form[field.key] || ""}
                    onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    className={formInput}
                    value={form[field.key] || ""}
                    onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                  />
                )}
              </FormField>
            );
          })}
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete record?"
        message="This will soft-delete the record."
        danger
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageShell>
  );
}

export { StatusBadge };

function clearModuleCache(apiPath: string) {
  for (const key of moduleDataCache.keys()) {
    if (key.startsWith(`${apiPath}?`)) {
      moduleDataCache.delete(key);
    }
  }
}
