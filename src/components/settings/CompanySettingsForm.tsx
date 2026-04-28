"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Upload, Loader2, CheckCircle2, Globe, Mail, Phone, MapPin, Building } from "lucide-react";
import toast from "react-hot-toast";

export default function CompanySettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    companyName: "",
    companyEmail: "",
    companyMobile: "",
    companyWebsite: "",
    companyAddress: "",
    companyLogo: { url: "" },
    directorSignature: { url: "" },
    seniorHrSignature: { url: "" },
  });

  const [previews, setPreviews] = useState<any>({
    logo: "",
    director: "",
    hr: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings/company");
      const data = await res.json();
      if (data) {
        setSettings(data);
        setPreviews({
          logo: data.companyLogo?.url || "",
          director: data.directorSignature?.url || "",
          hr: data.seniorHrSignature?.url || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev: any) => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("companyName", settings.companyName);
      formData.append("companyEmail", settings.companyEmail);
      formData.append("companyMobile", settings.companyMobile);
      formData.append("companyWebsite", settings.companyWebsite);
      formData.append("companyAddress", settings.companyAddress);

      const logoInput = document.getElementById("logo-upload") as HTMLInputElement;
      if (logoInput.files?.[0]) formData.append("companyLogo", logoInput.files[0]);

      const directorInput = document.getElementById("director-sign-upload") as HTMLInputElement;
      if (directorInput.files?.[0]) formData.append("directorSignature", directorInput.files[0]);

      const hrInput = document.getElementById("hr-sign-upload") as HTMLInputElement;
      if (hrInput.files?.[0]) formData.append("seniorHrSignature", hrInput.files[0]);

      const res = await fetch("/api/settings/company", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Settings saved successfully");
        fetchSettings();
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Company Information</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Basic details about your organization.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Name</label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              name="companyEmail"
              value={settings.companyEmail}
              onChange={handleChange}
              placeholder="contact@company.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mobile Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              name="companyMobile"
              value={settings.companyMobile}
              onChange={handleChange}
              placeholder="+91 0000000000"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Website URL</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              name="companyWebsite"
              value={settings.companyWebsite}
              onChange={handleChange}
              placeholder="https://www.company.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 size-4 text-slate-400" />
            <textarea
              name="companyAddress"
              value={settings.companyAddress}
              onChange={handleChange}
              placeholder="Full office address"
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800" />

      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Assets & Signatures</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Upload your logo and authorized signatures.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Company Logo */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Logo</label>
          <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-cyan-400 dark:border-slate-800 dark:bg-slate-950">
            {previews.logo ? (
              <img src={previews.logo} alt="Logo Preview" className="h-full w-full object-contain p-4" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Upload className="size-8" />
                <span className="text-xs">Upload Logo</span>
              </div>
            )}
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "logo")}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>
        </div>

        {/* Director Signature */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Director Signature</label>
          <div className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-cyan-400 dark:border-slate-800 dark:bg-slate-950">
            {previews.director ? (
              <img src={previews.director} alt="Director Sign Preview" className="h-full w-full object-contain p-4" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Upload className="size-8" />
                <span className="text-xs">Upload Signature</span>
              </div>
            )}
            <input
              id="director-sign-upload"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "director")}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>
        </div>

        {/* Senior HR Signature */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Senior HR Signature</label>
          <div className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-cyan-400 dark:border-slate-800 dark:bg-slate-950">
            {previews.hr ? (
              <img src={previews.hr} alt="HR Sign Preview" className="h-full w-full object-contain p-4" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Upload className="size-8" />
                <span className="text-xs">Upload Signature</span>
              </div>
            )}
            <input
              id="hr-sign-upload"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "hr")}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 px-8 py-3 font-semibold text-white transition-all hover:bg-cyan-700 hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
}
