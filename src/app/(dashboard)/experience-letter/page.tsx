"use client";

import React, { useState } from "react";
import { ExperienceForm } from "@/components/ExperienceForm";
import { ExperiencePreview } from "@/components/ExperiencePreview";
import { ExperienceLetterData } from "@/utils/experienceLetterGenerator";
import { FileBadge, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ExperienceLetterPage() {
  const [formData, setFormData] = useState<ExperienceLetterData>({
    employeeName: "",
    companyName: "Somesh Coder Ltd", // Default
    role: "",
    joiningDate: "",
    endingDate: new Date().toISOString().split('T')[0],
    performance: "Excellent",
    remarks: "",
    template: "professional",
  });

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1 rounded-full bg-cyan-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400">
                    <Sparkles className="size-3" /> New Feature
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Documents Suite
                </p>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Experience Letter <span className="text-cyan-600 dark:text-cyan-400">Generator</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Generate professional experience certificates in seconds. Auto-fill employee data, calculate duration, and export as premium PDF.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400 shadow-lg shadow-cyan-600/10"
          >
             <FileBadge className="h-7 w-7" />
          </motion.div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_600px]">
          <ExperienceForm data={formData} onChange={setFormData} />
          <ExperiencePreview data={formData} />
        </div>
      </div>
      
      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-24 size-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-24 size-96 rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>
    </div>
  );
}
