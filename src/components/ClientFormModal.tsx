"use client";

import React, { useState, useEffect } from "react";
import { IClient, IClientFormData, ClientStatus, HostingProvider } from "@/types/client";

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: IClient | null;
  onSaved: (client: IClient) => void;
}

export function ClientFormModal({ isOpen, onClose, client, onSaved }: ClientFormModalProps) {
  const [formData, setFormData] = useState<IClientFormData>({
    name: "",
    mobileNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    status: "Pending",
      domainDetails: {
        domainName: "",
        businessName: "",
        category: "",
        renewalDate: "",
        domainRegistrar: "",
        hostingExpiryDate: "",
        hostingCompany: "",
        hostingProvider: "Provider",
        remarks: "",
      },
    });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom dropdown state
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        mobileNumber: client.mobileNumber || "",
        email: client.email || "",
        address: client.address || "",
        city: client.city || "",
        state: client.state || "",
        status: client.status || "Pending",
        domainDetails: {
          domainName: client.domainDetails?.domainName || "",
          businessName: client.domainDetails?.businessName || "",
          category: client.domainDetails?.category || "",
          renewalDate: client.domainDetails?.renewalDate ? new Date(client.domainDetails.renewalDate).toISOString().split('T')[0] : "",
          domainRegistrar: client.domainDetails?.domainRegistrar || "",
          hostingExpiryDate: client.domainDetails?.hostingExpiryDate ? new Date(client.domainDetails.hostingExpiryDate).toISOString().split('T')[0] : "",
          hostingCompany: client.domainDetails?.hostingCompany || "",
          hostingProvider: client.domainDetails?.hostingProvider || "Provider",
          remarks: client.domainDetails?.remarks || "",
        },
      });
    } else {
      setFormData({
        name: "",
        mobileNumber: "",
        email: "",
        address: "",
        city: "",
        state: "",
        status: "Pending",
        domainDetails: {
          domainName: "",
          businessName: "",
          category: "",
          renewalDate: "",
          domainRegistrar: "",
          hostingExpiryDate: "",
          hostingCompany: "",
          hostingProvider: "Provider",
          remarks: "",
        },
      });
    }
    setError(null);
  }, [client, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("domainDetails.")) {
      const domainField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        domainDetails: {
          ...prev.domainDetails,
          [domainField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const url = client ? `/api/clients/${client._id}` : `/api/clients`;
    const method = client ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save client");
      }

      const savedClient = await res.json();
      onSaved(savedClient);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 sm:p-6 backdrop-blur-md transition-all duration-300">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800 flex flex-col animate-in fade-in zoom-in-95 duration-500">
        
        {/* Animated Background Gradients */}
        <div className="pointer-events-none absolute -inset-10 opacity-30 blur-[100px] z-0" aria-hidden>
          <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-cyan-400/40 mix-blend-multiply filter animate-pulse"></div>
          <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-indigo-500/30 mix-blend-multiply filter animate-pulse duration-2000"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-emerald-500/20 mix-blend-multiply filter animate-pulse duration-1000"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 p-6 sm:p-8 backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
              {client ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
              )}
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {client ? "Update Client Profile" : "Onboard New Client"}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
                {client ? "Refine details for existing partnership" : "Establish a new digital identity record"}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="group rounded-full p-3 bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-all duration-300"
          >
            <svg className="h-6 w-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Body */}
        <div className="relative z-10 overflow-y-auto p-6 sm:p-10 custom-scrollbar bg-white/40 dark:bg-slate-950/40">
          <form id="client-form" onSubmit={handleSubmit} className="space-y-12">
            {error && (
              <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-sm border border-rose-200 dark:border-rose-900/30 flex items-start gap-3 shadow-lg shadow-rose-500/10 animate-in slide-in-from-top-4">
                <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <div className="font-medium">{error}</div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              {/* Account Identity Section */}
              <div className="lg:col-span-5 space-y-8">
                <div className="flex items-center gap-4 group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Personal Profile</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Client Name <span className="text-rose-500">*</span></label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full legal name" className="w-full rounded-2xl bg-white dark:bg-slate-900/80 p-4 border border-slate-200 dark:border-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 dark:focus:ring-cyan-400/5 dark:focus:border-cyan-400 transition-all shadow-sm font-medium" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="relative">
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Mobile Number <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></span>
                        <input required type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="+91" className="w-full pl-12 rounded-2xl bg-white dark:bg-slate-900/80 p-4 border border-slate-200 dark:border-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all shadow-sm font-medium" />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Email <span className="font-normal lowercase opacity-60">(opt)</span></label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></span>
                        <input type="email" name="email" value={formData.email || ""} onChange={handleChange} placeholder="client@mail.com" className="w-full pl-12 rounded-2xl bg-white dark:bg-slate-900/80 p-4 border border-slate-200 dark:border-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all shadow-sm font-medium" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Work Address / Location</label>
                    <input type="text" name="address" value={formData.address || ""} onChange={handleChange} placeholder="Street, Block, Landmark" className="w-full rounded-2xl bg-white dark:bg-slate-900/80 p-4 border border-slate-200 dark:border-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all shadow-sm font-medium" />
                    <div className="grid grid-cols-2 gap-5">
                      <input type="text" name="city" value={formData.city || ""} onChange={handleChange} placeholder="City" className="w-full rounded-2xl bg-white dark:bg-slate-900/80 p-4 border border-slate-200 dark:border-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all shadow-sm font-medium" />
                      <input type="text" name="state" value={formData.state || ""} onChange={handleChange} placeholder="State" className="w-full rounded-2xl bg-white dark:bg-slate-900/80 p-4 border border-slate-200 dark:border-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all shadow-sm font-medium" />
                    </div>
                  </div>
                </div>

                {/* Account Status Card */}
                <div className="group relative p-6 rounded-3xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Relationship Status</label>
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>
                  
                  <div className="relative" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsStatusOpen(false); }}>
                    <div 
                      className="w-full flex justify-between items-center bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100 cursor-pointer shadow-sm hover:border-emerald-300 dark:hover:border-emerald-600 transition-all" 
                      onClick={() => setIsStatusOpen(!isStatusOpen)}
                    >
                      <span className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${
                          formData.status === "Completed (Live)" ? "bg-emerald-500" :
                          formData.status === "Work in Progress" ? "bg-cyan-500" :
                          formData.status === "Pending" ? "bg-amber-500" : "bg-rose-500"
                        }`}></div>
                        {formData.status}
                      </span>
                      <svg className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isStatusOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </div>

                    <div className={`absolute left-0 right-0 bottom-full mb-3 z-50 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-300 origin-bottom transform ${isStatusOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"}`}>
                      {["Work in Progress", "Pending", "Completed (Live)", "Expired / Not Working"].map((statusOption) => (
                        <div 
                          key={statusOption}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, status: statusOption as ClientStatus }));
                            setIsStatusOpen(false);
                          }}
                          className={`px-5 py-4 cursor-pointer text-sm font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 ${formData.status === statusOption ? "text-cyan-600 bg-cyan-50/50 dark:text-cyan-400 dark:bg-cyan-900/20" : "text-slate-600 dark:text-slate-400"}`}
                        >
                          <div className={`h-2 w-2 rounded-full ${
                            statusOption === "Completed (Live)" ? "bg-emerald-500" :
                            statusOption === "Work in Progress" ? "bg-cyan-500" :
                            statusOption === "Pending" ? "bg-amber-500" : "bg-rose-500"
                          }`}></div>
                          {statusOption}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital Assets Section */}
              <div className="lg:col-span-7 space-y-10">
                <div className="flex items-center gap-4 group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">App & Infrastructure</h3>
                </div>

                <div className="space-y-10">
                  {/* General App Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="relative col-span-1 sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Business Identity / Brand Name</label>
                      <input type="text" name="domainDetails.businessName" value={formData.domainDetails!.businessName || ""} onChange={handleChange} placeholder="e.g. Acme Corporation" className="w-full rounded-2xl bg-white dark:bg-slate-900/80 p-4 border border-slate-200 dark:border-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm font-medium" />
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Domain URL</label>
                      <input type="text" name="domainDetails.domainName" value={formData.domainDetails!.domainName || ""} onChange={handleChange} placeholder="example.com" className="w-full rounded-2xl bg-white dark:bg-slate-900/80 p-4 border border-slate-200 dark:border-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm font-medium" />
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">App Category</label>
                      <input type="text" name="domainDetails.category" value={formData.domainDetails!.category || ""} onChange={handleChange} placeholder="E-commerce, Portfolio, etc." className="w-full rounded-2xl bg-white dark:bg-slate-900/80 p-4 border border-slate-200 dark:border-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm font-medium" />
                    </div>
                  </div>

                  {/* Two Column Grid for Domain vs Hosting */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* Domain Subsection */}
                    <div className="p-6 rounded-3xl bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/20 space-y-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L10.242 9m4.586 4.586l-1.101 1.101m-.758-4.826L11.758 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.101 1.101"></path></svg>
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">Domain Configuration</h4>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="relative">
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Expiry Date</label>
                          <input type="date" name="domainDetails.renewalDate" value={formData.domainDetails!.renewalDate || ""} onChange={handleChange} className="w-full rounded-xl bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-semibold" />
                        </div>
                        <div className="relative">
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Purchased From</label>
                          <input type="text" name="domainDetails.domainRegistrar" value={formData.domainDetails!.domainRegistrar || ""} onChange={handleChange} placeholder="GoDaddy, Namecheap..." className="w-full rounded-xl bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium" />
                        </div>
                      </div>
                    </div>

                    {/* Hosting Subsection */}
                    <div className="p-6 rounded-3xl bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 space-y-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">Hosting Infrastructure</h4>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="relative">
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Expiry Date</label>
                          <input type="date" name="domainDetails.hostingExpiryDate" value={formData.domainDetails!.hostingExpiryDate || ""} onChange={handleChange} className="w-full rounded-xl bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-semibold" />
                        </div>
                        <div className="relative">
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Hosting Provider</label>
                          <input type="text" name="domainDetails.hostingCompany" value={formData.domainDetails!.hostingCompany || ""} onChange={handleChange} placeholder="Hostinger, AWS, DigitalOcean..." className="w-full rounded-xl bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Management Type</label>
                      <div className="relative">
                        <select name="domainDetails.hostingProvider" value={formData.domainDetails!.hostingProvider || "Provider"} onChange={handleChange} className="w-full rounded-2xl bg-white dark:bg-slate-900/80 p-4 pr-10 border border-slate-200 dark:border-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm font-bold appearance-none">
                          <option value="Provider">Company Managed</option>
                          <option value="Others">Self / External Managed</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Additional Remarks</label>
                      <textarea name="domainDetails.remarks" value={formData.domainDetails!.remarks || ""} onChange={handleChange} rows={1} placeholder="Specific config notes..." className="w-full rounded-2xl bg-white dark:bg-slate-900/80 p-4 border border-slate-200 dark:border-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm font-medium resize-none"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Action Footer */}
        <div className="relative z-10 flex items-center justify-end gap-5 border-t border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 p-8 backdrop-blur-2xl">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            Cancel
          </button>
          
          <button 
            form="client-form"
            type="submit" 
            disabled={isLoading} 
            className="group relative overflow-hidden px-12 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold shadow-2xl hover:shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_2s_infinite]"></div>
            
            <div className="relative flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Saving Record...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                  <span>{client ? "Update Record" : "Finalize Onboarding"}</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );

}
