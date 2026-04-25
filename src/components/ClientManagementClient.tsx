"use client";

import React, { useState } from "react";
import { IClient, ClientStatus } from "@/types/client";
import { ClientFormModal } from "./ClientFormModal";

interface ClientManagementClientProps {
  initialClients: IClient[];
  serverError: string | null;
}

export default function ClientManagementClient({
  initialClients,
  serverError,
}: ClientManagementClientProps) {
  const [clients, setClients] = useState<IClient[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<IClient | null>(null);

  const getStatusColor = (status: ClientStatus) => {
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
  };

  const handleAddClick = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (client: IClient) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete client");
      setClients((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting client");
    }
  };

  const handleSaved = (savedClient: IClient) => {
    if (editingClient) {
      setClients((prev) =>
        prev.map((c) => (c._id === savedClient._id ? savedClient : c))
      );
    } else {
      setClients((prev) => [savedClient, ...prev]);
    }
    setIsModalOpen(false);
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (serverError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl border border-red-200 dark:border-red-900 mt-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Database Error</h2>
        <p>{serverError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none w-full sm:w-64 shadow-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none w-full sm:w-48 shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Work in Progress">Work in Progress</option>
            <option value="Pending">Pending</option>
            <option value="Completed (Live)">Completed (Live)</option>
            <option value="Expired / Not Working">Expired / Not Working</option>
          </select>
        </div>
        
        <button
          onClick={handleAddClick}
          className="w-full sm:w-auto px-6 py-2.5 bg-cyan-600 text-white rounded-xl shadow-lg shadow-cyan-500/30 hover:bg-cyan-700 hover:-translate-y-0.5 transition-all font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Add New Client
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-4 pl-6">Client Info</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Domain / Package</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No clients found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 pl-6 align-top">
                      <div className="font-medium text-slate-900 dark:text-white">{client.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {client.domainDetails?.businessName || client.city || "No business name"}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="text-slate-700 dark:text-slate-300">{client.mobileNumber}</div>
                      {client.email && (
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{client.email}</div>
                      )}
                    </td>
                    <td className="p-4 align-top">
                      <div className="text-slate-700 dark:text-slate-300 font-medium">
                        {client.domainDetails?.domainName || "No Domain"}
                      </div>
                      {client.domainDetails?.hostingProvider && (
                        <div className="text-xs inline-flex items-center mt-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          Host: {client.domainDetails.hostingCompany || client.domainDetails.hostingProvider}
                        </div>
                      )}

                    </td>
                    <td className="p-4 align-top">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 align-top">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(client)}
                          className="p-2 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/40 rounded-lg transition"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </button>
                        <button
                          onClick={() => handleDelete(client._id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg transition"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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

      <ClientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        client={editingClient}
        onSaved={handleSaved}
      />
    </div>
  );
}
