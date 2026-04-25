"use client";

import React, { useState, useMemo } from "react";
import { SalaryForm } from "@/components/SalaryForm";
import { SalarySummary } from "@/components/SalarySummary";
import { calculateSalary, SalaryStructure } from "@/utils/salaryCalculator";

export default function AttendancePayrollPage() {
  const [formData, setFormData] = useState<SalaryStructure>({
    monthlySalary: 0,
    totalDays: 30,
    unpaidLeaves: 0,
    paidLeaves: 0,
    bonus: 0,
    overtime: 0,
    taxPercentage: 0,
    otherDeductions: 0,
    joiningDate: "",
    leavingDate: "",
  });

  const breakdown = useMemo(() => calculateSalary(formData), [formData]);

  return (
    <div className="min-h-screen flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] -right-[5%] h-[35%] w-[35%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse duration-[3000ms]"></div>
        <div className="absolute -bottom-[10%] left-[20%] h-[30%] w-[50%] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse duration-[5000ms]"></div>
      </div>

      <div className="mx-auto max-w-7xl space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <header className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/60 p-8 shadow-sm backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/60 sm:p-10">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/30">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Financial Operations</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                Attendance <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-400">&</span> Payroll
              </h1>
              <p className="max-w-2xl text-base sm:text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                Precision-engineered salary calculation system. Process attendance metrics, apply incentives, 
                and handle government deductions with absolute accuracy.
              </p>
            </div>
            
            <div className="hidden lg:flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-2xl shadow-cyan-500/20 rotate-3 hover:rotate-0 transition-transform duration-500">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 xl:col-span-8">
            <SalaryForm data={formData} onChange={setFormData} />
          </div>
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8">
            <SalarySummary
              breakdown={breakdown}
              joiningDate={formData.joiningDate}
              leavingDate={formData.leavingDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

