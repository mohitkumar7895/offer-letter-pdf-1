"use client";

import React from "react";
import { SalaryStructure } from "@/utils/salaryCalculator";

interface Props {
  data: SalaryStructure;
  onChange: (newData: SalaryStructure) => void;
}

export const SalaryForm: React.FC<Props> = ({ data, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleMonthYearChange = (monthIdx: number, year: number) => {
    // monthIdx is 0-based (0 for Jan, 1 for Feb...)
    // Setting day to 0 in next month gives total days in current month
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    onChange({ ...data, totalDays: daysInMonth });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    onChange({
      ...data,
      [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) || 0 : value,
    });
  };

  const inputClass =
    "mt-1.5 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400/5 placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-sm";

  const selectClass =
    "mt-1.5 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 appearance-none shadow-sm cursor-pointer";

  return (
    <div className="space-y-10 rounded-[2.5rem] border border-slate-200/60 bg-white/70 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800/60 pb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Earnings & Metrics</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Configure individual payroll parameters</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3 sm:flex-1">
          <div className="relative group">
            <select
              defaultValue={new Date().getMonth()}
              onChange={(e) => handleMonthYearChange(parseInt(e.target.value), currentYear)}
              className={`${selectClass} pr-10 min-w-[140px]`}
            >
              {months.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-cyan-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <div className="relative group">
            <select
              defaultValue={currentYear}
              onChange={(e) => handleMonthYearChange(new Date().getMonth(), parseInt(e.target.value))}
              className={`${selectClass} pr-10 min-w-[100px]`}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-cyan-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          
          <div className="flex h-[52px] items-center px-5 rounded-2xl bg-cyan-500 text-white font-black text-sm shadow-lg shadow-cyan-500/20">
            {data.totalDays} Days
          </div>
        </div>
      </div>



      {/* Section: Period & Identity */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z"></path></svg>
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Employment Cycle</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Joining Date</span>
            <input
              type="date"
              name="joiningDate"
              value={data.joiningDate || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Relieving Date (Optional)</span>
            <input
              type="date"
              name="leavingDate"
              value={data.leavingDate || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </label>
        </div>
      </div>

      {/* Section: Core Salary & Attendance */}
      <div className="space-y-6 border-t border-slate-100 dark:border-slate-800/60 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Compensation & Attendance</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <label className="block md:col-span-2 lg:col-span-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Monthly Base Salary</span>
            <div className="relative">
              <span className="absolute left-4 top-[22px] text-slate-300 dark:text-slate-700 font-bold">₹</span>
              <input
                type="number"
                name="monthlySalary"
                value={data.monthlySalary || ""}
                onChange={handleChange}
                placeholder="0"
                className={`${inputClass} pl-8 text-indigo-600 dark:text-indigo-400`}
              />
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Paid Leaves (PL)</span>
            <input
              type="number"
              name="paidLeaves"
              value={data.paidLeaves || ""}
              onChange={handleChange}
              placeholder="0"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Unpaid Leaves (LOP)</span>
            <input
              type="number"
              name="unpaidLeaves"
              value={data.unpaidLeaves || ""}
              onChange={handleChange}
              placeholder="0"
              className={`${inputClass} text-rose-500`}
            />
          </label>
        </div>

        <div className="flex items-center gap-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-950 p-6 border border-slate-100 dark:border-slate-800/60">
           <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
              <span className="text-lg font-black text-cyan-600 dark:text-cyan-400">{(data.totalDays - data.unpaidLeaves - data.paidLeaves) + data.paidLeaves}</span>
           </div>
           <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Total Payable Days</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                {data.totalDays - data.unpaidLeaves - data.paidLeaves} Worked + {data.paidLeaves} Paid Leaves
              </p>
           </div>
        </div>
      </div>

      {/* Section: Incentives & Deductions */}
      <div className="grid gap-10 md:grid-cols-2 border-t border-slate-100 dark:border-slate-800/60 pt-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Incentives</h3>
          </div>
          <div className="grid gap-4">
            <label className="block">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Performance Bonus</span>
              <input
                type="number"
                name="bonus"
                value={data.bonus || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Overtime Allowance</span>
              <input
                type="number"
                name="overtime"
                value={data.overtime || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Deductions</h3>
          </div>
          <div className="grid gap-4">
            <label className="block">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Tax Provision (TDS %)</span>
              <input
                type="number"
                name="taxPercentage"
                value={data.taxPercentage || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Miscellaneous Adjustments</span>
              <input
                type="number"
                name="otherDeductions"
                value={data.otherDeductions || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-[2rem] bg-slate-900 dark:bg-slate-950 p-6 sm:p-8 text-white border border-white/5 shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <h4 className="text-lg font-black tracking-tight">Statutory PF Deduction</h4>
               <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-black uppercase tracking-tighter text-cyan-400">Standard 12%</span>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
              Apply a fixed 12% provident fund deduction on the base salary according to regional labor compliance.
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center shrink-0">
            <input
              type="checkbox"
              name="enablePF"
              checked={data.enablePF || false}
              onChange={handleChange}
              className="peer sr-only"
            />
            <div className="peer h-8 w-14 rounded-full bg-slate-800 after:absolute after:left-[4px] after:top-[4px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-cyan-500 peer-checked:after:translate-x-6 peer-focus:outline-none transition-colors border border-white/5"></div>
          </label>
        </div>
        {/* Abstract Background Effect */}
        <div className="absolute top-0 right-0 h-32 w-32 bg-cyan-500/10 blur-[60px] pointer-events-none"></div>
      </div>
    </div>
  );
};

