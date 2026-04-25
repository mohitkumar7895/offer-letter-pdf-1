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
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Animated Background Gradients */}
        <div className="pointer-events-none absolute -inset-10 opacity-30 blur-2xl z-0" aria-hidden>
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-cyan-400/40 mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 left-0 h-48 w-48 rounded-full bg-indigo-500/30 mix-blend-multiply filter blur-3xl animate-pulse duration-1000"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-6 backdrop-blur-xl">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-indigo-400">
              {client ? "Edit Client Profile" : "Add New Client"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {client ? "Update the details for this client." : "Fill out the information below to onboard a new client."}
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="rounded-full p-2.5 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white transition-all transform hover:rotate-90 duration-300 hover:scale-110"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Body */}
        <div className="relative z-10 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/20">
          <form id="client-form" onSubmit={handleSubmit} className="space-y-10">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200 flex items-start gap-3 shadow-sm animate-in slide-in-from-top-4">
                <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Account Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-cyan-100 dark:border-cyan-900/30 pb-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-cyan-400">Account Identity</h3>
                </div>
                
                <div className="space-y-5">
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400">Client Name <span className="text-rose-500">*</span></label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" className="w-full rounded-2xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 dark:focus:ring-cyan-400/10 dark:focus:border-cyan-400 transition-all shadow-sm hover:border-slate-300 dark:hover:border-slate-600" />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400">Mobile Number <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></span>
                      <input required type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="+91 9876543210" className="w-full pl-11 rounded-2xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 dark:focus:border-cyan-400 transition-all shadow-sm" />
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400">Email Address <span className="font-normal text-slate-400">(optional)</span></label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></span>
                      <input type="email" name="email" value={formData.email || ""} onChange={handleChange} placeholder="client@example.com" className="w-full pl-11 rounded-2xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 dark:focus:border-cyan-400 transition-all shadow-sm" />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400">Address Info</label>
                    <div className="grid grid-cols-1 gap-4">
                      <input type="text" name="address" value={formData.address || ""} onChange={handleChange} placeholder="Street Address" className="w-full rounded-2xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 dark:focus:border-cyan-400 transition-all shadow-sm" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" name="city" value={formData.city || ""} onChange={handleChange} placeholder="City" className="w-full rounded-2xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 dark:focus:border-cyan-400 transition-all shadow-sm" />
                        <input type="text" name="state" value={formData.state || ""} onChange={handleChange} placeholder="State" className="w-full rounded-2xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 dark:focus:border-cyan-400 transition-all shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Domain Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-indigo-100 dark:border-indigo-900/30 pb-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-indigo-400">App & Domain Details</h3>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 group">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">Business Name</label>
                      <input type="text" name="domainDetails.businessName" value={formData.domainDetails!.businessName || ""} onChange={handleChange} placeholder="e.g. Acme Corp" className="w-full rounded-2xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-sm" />
                    </div>

                    <div className="col-span-2 group">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">Domain Name</label>
                      <input type="text" name="domainDetails.domainName" value={formData.domainDetails!.domainName || ""} onChange={handleChange} placeholder="e.g. acme.com" className="w-full rounded-2xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-sm" />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">Category</label>
                      <input type="text" name="domainDetails.category" value={formData.domainDetails!.category || ""} onChange={handleChange} placeholder="e.g. Retail" className="w-full rounded-2xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-sm" />
                    </div>
                    
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">Domain Expiry Date</label>
                      <input type="date" name="domainDetails.renewalDate" value={formData.domainDetails!.renewalDate || ""} onChange={handleChange} className="w-full rounded-2xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-sm text-sm" />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">Domain Company</label>
                      <input type="text" name="domainDetails.domainRegistrar" value={formData.domainDetails!.domainRegistrar || ""} onChange={handleChange} placeholder="e.g. GoDaddy" className="w-full rounded-2xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-sm" />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">Hosting Expiry Date</label>
                      <input type="date" name="domainDetails.hostingExpiryDate" value={formData.domainDetails!.hostingExpiryDate || ""} onChange={handleChange} className="w-full rounded-2xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-sm text-sm" />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">Hosting Company</label>
                      <input type="text" name="domainDetails.hostingCompany" value={formData.domainDetails!.hostingCompany || ""} onChange={handleChange} placeholder="e.g. Hostinger" className="w-full rounded-2xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-sm" />
                    </div>

                    <div className="col-span-2 group">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">Hosting Provider Type</label>
                      <div className="relative">
                        <select name="domainDetails.hostingProvider" value={formData.domainDetails!.hostingProvider || "Provider"} onChange={handleChange} className="w-full rounded-2xl bg-white dark:bg-slate-800/80 p-3.5 pr-10 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-sm appearance-none">
                          <option value="Provider">Company Provider</option>
                          <option value="Others">Other / External</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-indigo-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2 group">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">Remarks</label>
                      <textarea name="domainDetails.remarks" value={formData.domainDetails!.remarks || ""} onChange={handleChange} rows={2} placeholder="Any additional notes..." className="w-full rounded-2xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-sm resize-none"></textarea>
                    </div>

                    <div className="col-span-2 group relative p-[2px] rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 mt-2 hover:shadow-lg transition-all" tabIndex={0} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsStatusOpen(false); }}>
                      <div className="bg-white dark:bg-slate-900 rounded-[14px] p-2 flex flex-col relative">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 pl-2 pt-1 transition-colors group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400">Account Status Target</label>
                        
                        <div 
                          className="w-full flex justify-between items-center bg-transparent p-2 text-lg font-bold outline-none text-slate-800 dark:text-slate-100 cursor-pointer" 
                          onClick={() => setIsStatusOpen(!isStatusOpen)}
                        >
                          <span>{formData.status}</span>
                          <svg className={`w-5 h-5 text-emerald-500 transition-transform duration-300 ${isStatusOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                        </div>

                        {/* Custom Animated Dropdown Menu */}
                        <div className={`absolute left-0 right-0 top-[105%] z-50 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 origin-top transform ${isStatusOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                          {["Work in Progress", "Pending", "Completed (Live)", "Expired / Not Working"].map((statusOption) => (
                            <div 
                              key={statusOption}
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, status: statusOption as ClientStatus }));
                                setIsStatusOpen(false);
                              }}
                              className={`px-4 py-3 cursor-pointer text-sm font-semibold transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/30 ${formData.status === statusOption ? "text-emerald-600 bg-emerald-50/50 dark:text-emerald-400 dark:bg-emerald-900/40" : "text-slate-700 dark:text-slate-300"}`}
                            >
                              {statusOption}
                            </div>
                          ))}
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Action Footer */}
        <div className="relative z-10 flex items-center justify-end gap-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 p-6 backdrop-blur-xl">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-3 rounded-2xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm hover:shadow active:scale-95"
          >
            Cancel
          </button>
          
          <button 
            form="client-form"
            type="submit" 
            disabled={isLoading} 
            className="group relative overflow-hidden px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-600/30 hover:shadow-cyan-600/50 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
            
            <div className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                  <span>{client ? "Update Client Record" : "Confirm & Save Client"}</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
