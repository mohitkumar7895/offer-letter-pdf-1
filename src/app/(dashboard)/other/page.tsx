"use client";

import React from "react";

export default function OtherDocumentsPage() {
  return (
    <div className="min-h-screen flex-1 px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-7 xl:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
        <header className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_15%_10%,rgba(45,212,191,0.16),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.14),transparent_38%)]"
            aria-hidden
          />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">
              Document Center
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Other Documents
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Management for miscellaneous documents and certificates.
            </p>
          </div>
        </header>

        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">No documents yet</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            This section is currently under development. You can use this space to manage additional document types.
          </p>
        </div>
      </div>
    </div>
  );
}
