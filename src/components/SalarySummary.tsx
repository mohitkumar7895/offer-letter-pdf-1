"use client";

import React from "react";
import { SalaryBreakdown } from "@/utils/salaryCalculator";

interface Props {
  breakdown: SalaryBreakdown;
  employeeName?: string;
  joiningDate?: string;
  leavingDate?: string;
}

export const SalarySummary: React.FC<Props> = ({
  breakdown,
  employeeName = "John Doe",
  joiningDate,
  leavingDate,
}) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val);

  return (
    <div className="flex flex-col gap-8">
      {/* Main Net Salary Card */}
      <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 dark:bg-slate-950 p-8 sm:p-10 text-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] dark:shadow-none transition-transform duration-500 hover:scale-[1.02]">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-transparent to-indigo-600/20 opacity-50"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Net Payable Remittance</span>
          </div>
          
          <div className="w-full px-4 overflow-hidden">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Estimated Monthly Net</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter tabular-nums drop-shadow-2xl break-words line-clamp-1">
              {formatCurrency(breakdown.netSalary)}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="rounded-3xl bg-white/5 p-3 sm:p-4 border border-white/5 backdrop-blur-xl overflow-hidden text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Attendance</p>
              <p className="text-sm sm:text-base lg:text-lg font-black text-emerald-400 truncate">
                {breakdown.workedDays} <span className="text-[9px] font-bold text-slate-400">Days</span>
              </p>
            </div>
            <div className="rounded-3xl bg-white/5 p-3 sm:p-4 border border-white/5 backdrop-blur-xl overflow-hidden text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Day Rate</p>
              <p className="text-sm sm:text-base lg:text-lg font-black text-cyan-400 truncate">
                {formatCurrency(Math.round(breakdown.perDaySalary))}
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none"></div>
      </div>

      {/* Detailed Breakdown Card */}
      <div className="rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/40">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Ledger Summary</h3>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4">
             {[
               { label: "Gross Base Earned", value: breakdown.grossEarned, type: "neutral" },
               { label: "Performance Bonus", value: breakdown.totalBonus, type: "positive" },
               { label: "Statutory PF (12%)", value: breakdown.pfDeduction, type: "negative" },
               { label: "Income Tax (TDS)", value: breakdown.taxDeduction, type: "negative" },
               { label: "Other Adjustments", value: (breakdown as any).otherDeductions || 0, type: "negative" },
             ].map((item, idx) => (
               <div key={idx} className="flex justify-between items-center group">
                 <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{item.label}</span>
                 <span className={`text-sm font-black tabular-nums ${
                   item.type === "positive" ? "text-emerald-500" : 
                   item.type === "negative" ? "text-rose-500" : 
                   "text-slate-900 dark:text-white"
                 }`}>
                   {item.type === "positive" ? "+" : item.type === "negative" ? "-" : ""}{formatCurrency(Math.abs(item.value))}
                 </span>
               </div>
             ))}
          </div>

          <div className="my-6 h-px bg-slate-100 dark:bg-slate-800"></div>

          <div className="flex justify-between items-center p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
             <span className="text-sm font-black uppercase tracking-widest text-slate-400">Final Net</span>
             <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
               {formatCurrency(breakdown.netSalary)}
             </span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="group mt-10 relative overflow-hidden flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-slate-900 px-6 py-5 text-sm font-black text-white transition-all hover:bg-slate-800 hover:shadow-2xl active:scale-[0.98] dark:bg-white dark:text-slate-900"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_2s_infinite]"></div>
          
          <svg className="h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2-2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Generate Official Salary Slip
        </button>
      </div>

      {/* Official Print-Ready Slip */}
      <div className="hidden print:block fixed inset-0 bg-white p-16 text-slate-900 z-[9999]">
        <div className="max-w-4xl mx-auto border-4 border-slate-900 p-12">
          <div className="flex justify-between items-center border-b-4 border-slate-900 pb-10 mb-10">
            <div>
              <h1 className="text-5xl font-black uppercase tracking-tighter italic">Salary Slip</h1>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mt-2">Official Payroll Remittance Advice</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black tracking-tight">EMS SUITE PREMIUM</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Ref ID: PAY-{Math.random().toString(36).substring(7).toUpperCase()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-16 mb-12">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Employee Identification</p>
                <p className="text-3xl font-black tracking-tight mt-1">{employeeName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400">Period</p>
                  <p className="text-xs font-bold">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400">Worked Days</p>
                  <p className="text-xs font-bold">{breakdown.workedDays} Days</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col justify-center text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Total Net Payable</p>
              <p className="text-4xl font-black tabular-nums">{formatCurrency(breakdown.netSalary)}</p>
            </div>
          </div>

          <div className="space-y-1">
             <div className="grid grid-cols-2 bg-slate-900 text-white p-3 text-[10px] font-black uppercase tracking-widest">
                <span>Description</span>
                <span className="text-right">Amount (INR)</span>
             </div>
             <div className="border-x-2 border-slate-900 divide-y-2 divide-slate-100">
               {[
                 { label: "Basic Base Earnings", val: breakdown.grossEarned },
                 { label: "Performance Incentive / Bonus", val: breakdown.totalBonus },
                 { label: "Overtime Allowance", val: (breakdown as any).overtime || 0 },
                 { label: "Statutory PF Deduction (12%)", val: -breakdown.pfDeduction },
                 { label: "Professional Tax / TDS", val: -breakdown.taxDeduction },
                 { label: "Other Miscellaneous Deductions", val: -((breakdown as any).otherDeductions || 0) }
               ].map((row, i) => row.val !== 0 && (
                 <div key={i} className="grid grid-cols-2 p-4 text-sm font-bold">
                    <span className="text-slate-600">{row.label}</span>
                    <span className={`text-right tabular-nums ${row.val < 0 ? "text-rose-600" : ""}`}>{formatCurrency(row.val)}</span>
                 </div>
               ))}
             </div>
             <div className="grid grid-cols-2 bg-slate-900 text-white p-6">
                <span className="text-xl font-black uppercase">Final Remittance</span>
                <span className="text-3xl text-right font-black tabular-nums">{formatCurrency(breakdown.netSalary)}</span>
             </div>
          </div>

          <div className="mt-16 pt-8 border-t-2 border-slate-100 flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400">Compliance & Validation</p>
              <p className="text-xs font-medium text-slate-500 italic">This document is electronically generated and carries legal weight for financial verification.</p>
            </div>
            <div className="h-16 w-16 bg-slate-100 rounded-xl border-2 border-slate-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
