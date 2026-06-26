"use client";

import { useMemo, useState } from "react";
import { Calculator, IndianRupee, RotateCcw } from "lucide-react";
import { Breadcrumb } from "@/components/modules/Breadcrumb";
import { btnPrimary, btnSecondary, formInput, formLabel } from "@/components/ui/FormUi";

type SalaryForm = {
  employeeName: string;
  month: string;
  monthlySalary: number;
  monthDays: number;
  unpaidLeaves: number;
  bonus: number;
  deductions: number;
};

const initialForm: SalaryForm = {
  employeeName: "",
  month: new Date().toLocaleString("en-IN", { month: "long", year: "numeric" }),
  monthlySalary: 0,
  monthDays: 30,
  unpaidLeaves: 0,
  bonus: 0,
  deductions: 0,
};

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export default function AttendancePayrollPage() {
  const [form, setForm] = useState<SalaryForm>(initialForm);

  const result = useMemo(() => {
    const monthDays = Math.max(1, form.monthDays || 30);
    const unpaidLeaves = Math.min(Math.max(0, form.unpaidLeaves || 0), monthDays);
    const payableDays = Math.max(0, monthDays - unpaidLeaves);
    const perDaySalary = (form.monthlySalary || 0) / monthDays;
    const earnedSalary = perDaySalary * payableDays;
    const netSalary = Math.max(0, earnedSalary + (form.bonus || 0) - (form.deductions || 0));

    return {
      monthDays,
      unpaidLeaves,
      payableDays,
      perDaySalary,
      earnedSalary,
      netSalary,
    };
  }, [form]);

  const update = (key: keyof SalaryForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]:
        key === "employeeName" || key === "month"
          ? value
          : Number(value) || 0,
    }));
  };

  return (
    <div className="min-h-screen flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "People & HR" },
            { label: "Salary Calculator" },
          ]}
        />

        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                People & HR
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                Simple Salary Calculator
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                Bas monthly salary, month days, unpaid leave, bonus aur deduction dalo.
                Net salary turant calculate ho jayegi.
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-600 text-white">
              <Calculator className="size-6" />
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">Salary Details</h2>
                <p className="text-xs text-slate-500">Simple input, no confusion.</p>
              </div>
              <button type="button" onClick={() => setForm(initialForm)} className={btnSecondary}>
                <RotateCcw className="size-4" />
                Reset
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Employee Name">
                <input
                  className={formInput}
                  value={form.employeeName}
                  onChange={(e) => update("employeeName", e.target.value)}
                  placeholder="Optional"
                />
              </Field>

              <Field label="Month">
                <input
                  className={formInput}
                  value={form.month}
                  onChange={(e) => update("month", e.target.value)}
                  placeholder="June 2026"
                />
              </Field>

              <Field label="Monthly Salary" required>
                <MoneyInput
                  value={form.monthlySalary}
                  onChange={(value) => update("monthlySalary", value)}
                  placeholder="30000"
                />
              </Field>

              <Field label="Total Days in Month" required>
                <input
                  className={formInput}
                  type="number"
                  min={1}
                  value={form.monthDays || ""}
                  onChange={(e) => update("monthDays", e.target.value)}
                />
              </Field>

              <Field label="Unpaid Leaves">
                <input
                  className={formInput}
                  type="number"
                  min={0}
                  value={form.unpaidLeaves || ""}
                  onChange={(e) => update("unpaidLeaves", e.target.value)}
                  placeholder="0"
                />
              </Field>

              <Field label="Bonus / Incentive">
                <MoneyInput
                  value={form.bonus}
                  onChange={(value) => update("bonus", value)}
                  placeholder="0"
                />
              </Field>

              <Field label="Other Deductions" className="sm:col-span-2">
                <MoneyInput
                  value={form.deductions}
                  onChange={(value) => update("deductions", value)}
                  placeholder="0"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:sticky lg:top-6">
            <div className="rounded-2xl bg-slate-950 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                Net Salary
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                {money(result.netSalary)}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {form.employeeName || "Employee"} · {form.month}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <SummaryRow label="Per Day Salary" value={money(result.perDaySalary)} />
              <SummaryRow label="Total Month Days" value={`${result.monthDays} days`} />
              <SummaryRow label="Unpaid Leaves" value={`${result.unpaidLeaves} days`} negative />
              <SummaryRow label="Payable Days" value={`${result.payableDays} days`} positive />
              <SummaryRow label="Earned Salary" value={money(result.earnedSalary)} />
              <SummaryRow label="Bonus / Incentive" value={`+ ${money(form.bonus)}`} positive />
              <SummaryRow label="Other Deductions" value={`- ${money(form.deductions)}`} negative />
            </div>

            <div className="mt-5 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900 dark:border-cyan-900/40 dark:bg-cyan-950/30 dark:text-cyan-200">
              Formula: <strong>Monthly Salary ÷ Month Days × Payable Days + Bonus - Deductions</strong>
            </div>

            <button type="button" onClick={() => window.print()} className={`${btnPrimary} mt-5 w-full`}>
              Print Summary
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={formLabel}>
        {label}
        {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function MoneyInput({
  value,
  onChange,
  placeholder,
}: {
  value: number;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <IndianRupee className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <input
        className={`${formInput} pl-10`}
        type="number"
        min={0}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function SummaryRow({
  label,
  value,
  positive,
  negative,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</span>
      <span
        className={`text-sm font-bold ${
          positive
            ? "text-emerald-600 dark:text-emerald-400"
            : negative
              ? "text-rose-600 dark:text-rose-400"
              : "text-slate-900 dark:text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

