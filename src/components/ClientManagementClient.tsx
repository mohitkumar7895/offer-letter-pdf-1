"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IClient, ClientStatus } from "@/types/client";
import { ClientFormModal } from "./ClientFormModal";
import { TableSkeleton } from "@/components/SkeletonLoader";
import { fetchJsonCached, getCachedJson, invalidateCachedUrl } from "@/lib/clientDataCache";

interface ClientManagementClientProps {
  initialClients?: IClient[];
  serverError?: string | null;
}

export default function ClientManagementClient({
  initialClients = [],
  serverError: initialError = null,
}: ClientManagementClientProps) {
  const [clients, setClients] = useState<IClient[]>(initialClients);
  const [loading, setLoading] = useState(initialClients.length === 0);
  const [serverError, setServerError] = useState<string | null>(initialError);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<IClient | null>(null);

  useEffect(() => {
    let active = true;
    const cached = getCachedJson<IClient[] | { items: IClient[] }>("/api/clients");
    if (cached) {
      const list = Array.isArray(cached) ? cached : cached.items || [];
      setClients(list.map((r) => ({ ...r, _id: String(r._id) })));
      setLoading(false);
    } else {
      setLoading(true);
    }

    fetchJsonCached<IClient[] | { items: IClient[] }>("/api/clients")
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data) ? data : data.items || [];
        setClients(
          list.map((r) => ({
            ...r,
            _id: String(r._id),
          })),
        );
        setServerError(null);
      })
      .catch(() => {
        if (active) setServerError("Failed to load customers");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const getStatusColor = useCallback((status: ClientStatus) => {
    switch (status) {
      case "Completed (Live)":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      case "Pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
      case "Work in Progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
      case "Expired / Not Working":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  }, []);

  const handleAddClick = useCallback(() => {
    setEditingClient(null);
    setIsModalOpen(true);
  }, []);

  const handleEditClick = useCallback((client: IClient) => {
    setEditingClient(client);
    setIsModalOpen(true);
  }, []);

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete client");
      setClients((prev) => prev.filter((c) => c._id !== id));
      invalidateCachedUrl("/api/clients");
    } catch (err) {
      console.error(err);
      alert("Error deleting client");
    }
  };

  const handleSaved = useCallback((savedClient: IClient) => {
    if (editingClient) {
      setClients((prev) =>
        prev.map((c) => (c._id === savedClient._id ? savedClient : c))
      );
    } else {
      setClients((prev) => [savedClient, ...prev]);
    }
    setIsModalOpen(false);
    invalidateCachedUrl("/api/clients");
  }, [editingClient]);

  const filteredClients = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase();
    return clients.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(normalizedQuery);
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchQuery, statusFilter]);

  if (serverError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl border border-red-200 dark:border-red-900 mt-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Database Error</h2>
        <p>{serverError}</p>
      </div>
    );
  }

  if (loading) {
    return <TableSkeleton columns={5} rows={6} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Controls: Search & Filter */}
      <div className="flex flex-col lg:flex-row gap-5 items-center justify-between bg-white/40 dark:bg-slate-900/40 p-4 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative group w-full sm:w-80">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none w-full shadow-sm transition-all font-medium"
            />
          </div>
          <div className="relative group w-full sm:w-56">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-4 pr-10 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none w-full shadow-sm transition-all appearance-none font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="All">All Statuses</option>
              <option value="Work in Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Completed (Live)">Completed</option>
              <option value="Expired / Not Working">Expired</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
          </div>
        </div>
        
        <button
          onClick={handleAddClick}
          className="group w-full lg:w-auto px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-0.5 transition-all font-extrabold flex items-center justify-center gap-3 active:scale-95"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20 dark:bg-slate-900/10 group-hover:rotate-90 transition-transform duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
          </div>
          Add New Client
        </button>
      </div>

      {/* Table Section */}
      <div className="relative group">
        {/* Subtle glow effect behind table */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        
        <div className="relative bg-white/80 dark:bg-slate-950/80 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-2xl overflow-hidden backdrop-blur-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/60">
                  <th className="p-6 pl-10 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Client Information</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Communication</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">App & Infrastructure</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Project Status</th>
                  <th className="p-6 pr-10 text-right text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900/40">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-20 w-20 rounded-3xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-700">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <p className="text-lg font-bold text-slate-400 dark:text-slate-600 tracking-tight">No client records found</p>
                        <button onClick={handleAddClick} className="text-sm font-extrabold text-cyan-600 dark:text-cyan-400 hover:underline">Register your first client</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client._id} className="group/row hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all duration-300">
                      <td className="p-6 pl-10 align-middle">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 font-black text-lg border border-slate-200 dark:border-slate-700 group-hover/row:scale-110 transition-transform shadow-sm">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base">{client.name}</div>
                            <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                              {client.domainDetails?.businessName || client.city || "Independent Client"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 align-middle">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-sm">
                            <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            {client.mobileNumber}
                          </div>
                          {client.email && (
                            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                              {client.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-6 align-middle">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-extrabold text-sm group/domain">
                            <div className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 group-hover/domain:bg-indigo-500 group-hover/domain:text-white transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                            </div>
                            {client.domainDetails?.domainName || "Domain Pending"}
                          </div>
                          {client.domainDetails?.hostingProvider && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-100 dark:border-emerald-900/30">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                              {client.domainDetails.hostingCompany || client.domainDetails.hostingProvider}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-6 align-middle">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl text-xs font-extrabold tracking-tight ${getStatusColor(client.status)} shadow-sm`}>
                          <div className={`h-1.5 w-1.5 rounded-full ${
                            client.status === "Completed (Live)" ? "bg-emerald-500" :
                            client.status === "Work in Progress" ? "bg-blue-500" :
                            client.status === "Pending" ? "bg-amber-500" : "bg-red-500"
                          }`}></div>
                          {client.status}
                        </span>
                      </td>
                      <td className="p-6 pr-10 align-middle">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEditClick(client)}
                            className="group/btn h-10 w-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-cyan-600 hover:border-cyan-300 dark:hover:text-cyan-400 dark:hover:border-cyan-800 transition-all hover:shadow-lg shadow-cyan-500/10 active:scale-90"
                            title="Edit Profile"
                          >
                            <svg className="w-5 h-5 transition-transform group-hover/btn:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>
                          <button
                            onClick={() => handleDelete(client._id)}
                            className="group/btn h-10 w-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-300 dark:hover:text-rose-400 dark:hover:border-rose-800 transition-all hover:shadow-lg shadow-rose-500/10 active:scale-90"
                            title="Archive Record"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ClientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        client={editingClient}
        onSaved={handleSaved}
      />
    </div>
  );

}
