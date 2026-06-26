"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CreditCard,
  FileText,
  Server,
  Users,
} from "lucide-react";
import { Breadcrumb } from "@/components/modules/Breadcrumb";
import { btnPrimary, btnSecondary } from "@/components/ui/FormUi";

const mainFlow = [
  {
    title: "Lead / Customer",
    text: "Customer master record yahin se start hota hai.",
    href: "/clients",
    icon: Users,
  },
  {
    title: "Project",
    text: "Customer ka kaam, budget, domain, payment aur maintenance se linked.",
    href: "/projects",
    icon: Briefcase,
  },
  {
    title: "Payment Ledger",
    text: "Kiska payment aaya, due kya hai, staff ko kya gaya.",
    href: "/payment-ledger",
    icon: CreditCard,
  },
  {
    title: "Maintenance / Renewal",
    text: "Project ke baad service, AMC, renewal follow-up.",
    href: "/maintenance",
    icon: Server,
  },
];

const peopleFlow = [
  ["Employees", "Staff master record", "/employees"],
  ["TL Management", "TL ke under employees", "/tls"],
  ["Staff Allocation", "Project par kaun kaam karega", "/staff-allocation"],
  ["Salary / Expenses", "Staff payout records", "/salary"],
] as const;

const dataModules = [
  ["Domains", "Domain expiry record", "/domains"],
  ["Service Charges", "Fees/GST/discount record", "/service-charges"],
  ["Office Expenses", "Office spending record", "/office-expenses"],
  ["Assets", "Company asset inventory", "/assets"],
  ["Purchasing", "Purchase request flow", "/purchases"],
  ["Reports", "Export CSV records", "/reports"],
] as const;

export default function BusinessFlowPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Overview" },
            { label: "Business Flow" },
          ]}
        />

        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
            System Map
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            Business Flow
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
            Yeh page batata hai ki kaunsi cheez connected workflow hai aur kaunsi cheez sirf record
            feed karne ke liye hai. Main flow: Customer → Project → Payment / Domain / Maintenance.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Main Customer Workflow</h2>
              <p className="text-xs text-slate-500">Connected modules. Ye ek dusre se relation rakhte hain.</p>
            </div>
            <Link href="/projects" className={btnPrimary}>
              Start Project
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            {mainFlow.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.href} className="relative">
                  <Link
                    href={step.href}
                    className="block h-full rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-cyan-400 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-cyan-700"
                  >
                    <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{step.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{step.text}</p>
                  </Link>
                  {index < mainFlow.length - 1 && (
                    <ArrowRight className="absolute -right-5 top-1/2 hidden size-5 -translate-y-1/2 text-slate-300 md:block" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <FlowList
            title="People & Staff Flow"
            description="Employee records, team leader structure, project allocation, salary and expenses."
            rows={peopleFlow}
          />
          <FlowList
            title="Data Feed Modules"
            description="Yeh modules record keeping ke liye hain. Inhe project/customer se link kar sakte ho where needed."
            rows={dataModules}
          />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
              <FileText className="size-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Document Modules</h2>
              <p className="mt-1 text-sm text-slate-500">
                Offer Letter, Experience Letter aur Other Documents HR/document work ke liye separate hain.
                Ye business payment flow ka duplicate nahi hain.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/offer-letter" className={btnSecondary}>Offer Letter</Link>
                <Link href="/experience-letter" className={btnSecondary}>Experience Letter</Link>
                <Link href="/other" className={btnSecondary}>Other Documents</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function FlowList({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: readonly (readonly [string, string, string])[];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="font-bold text-slate-900 dark:text-white">{title}</h2>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
      <div className="mt-4 space-y-2">
        {rows.map(([label, text, href]) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3 transition hover:border-cyan-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-cyan-800 dark:hover:bg-slate-950/40"
          >
            <span>
              <span className="block text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
              <span className="text-xs text-slate-500">{text}</span>
            </span>
            <ArrowRight className="size-4 text-slate-400" />
          </Link>
        ))}
      </div>
    </section>
  );
}
