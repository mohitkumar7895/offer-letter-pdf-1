"use client";

import React from "react";
import { SalaryStructure } from "@/utils/salaryCalculator";

interface Props {
  data: SalaryStructure;
  onChange: (newData: SalaryStructure) => void;
}

export const SalaryForm: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...data,
      [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) || 0 : value,
    });
  };

  const setTotalDays = (days: number) => {
    onChange({ ...data, totalDays: days });
  };

  const inputClass =
    "mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-cyan-500 dark:focus:bg-slate-900";

  return (
    <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Earnings & Attendance</h2>
        <div className="flex gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {[28, 29, 30, 31].map((d) => (
            <button
              key={d}
              onClick={() => setTotalDays(d)}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                data.totalDays === d
                  ? "bg-white text-cyan-600 shadow-sm dark:bg-slate-700 dark:text-cyan-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Employment Period</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Joining Date</span>
            <input
              type="date"
              name="joiningDate"
              value={data.joiningDate || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Leaving Date (Optional)</span>
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

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Monthly Salary (Base)</span>
          <input
            type="number"
            name="monthlySalary"
            value={data.monthlySalary || ""}
            onChange={handleChange}
            placeholder="e.g. 50000"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Paid Leaves</span>
          <input
            type="number"
            name="paidLeaves"
            value={data.paidLeaves || ""}
            onChange={handleChange}
            placeholder="Days"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Unpaid Leaves (LOP)</span>
          <input
            type="number"
            name="unpaidLeaves"
            value={data.unpaidLeaves || ""}
            onChange={handleChange}
            placeholder="Days"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Worked Days (Auto)</span>
          <div className="mt-1 block w-full rounded-xl border border-slate-100 bg-slate-100/50 px-4 py-3 text-sm font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
            {data.totalDays - data.unpaidLeaves} Days
          </div>
        </label>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Extra Earnings</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bonus / Incentives</span>
            <input
              type="number"
              name="bonus"
              value={data.bonus || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Overtime Pay</span>
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

      <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Deductions</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tax (%) (TDS)</span>
            <input
              type="number"
              name="taxPercentage"
              value={data.taxPercentage || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Other Deductions</span>
            <input
              type="number"
              name="otherDeductions"
              value={data.otherDeductions || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </label>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">PF Deduction (12%)</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Apply standard 12% provident fund deduction on base salary</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              name="enablePF"
              checked={data.enablePF || false}
              onChange={handleChange}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-cyan-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-slate-700"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
