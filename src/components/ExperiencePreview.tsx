"use client";

import React, { useRef } from "react";
import { ExperienceLetterData, calculateDuration, formatLetterDate } from "@/utils/experienceLetterGenerator";
import { motion } from "framer-motion";
import { Download, Printer, Share2, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Props {
  data: ExperienceLetterData;
}

export const ExperiencePreview: React.FC<Props> = ({ data }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const duration = calculateDuration(data.joiningDate, data.endingDate);
  const today = formatLetterDate(new Date().toISOString().split('T')[0]);

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Experience_Letter_${data.employeeName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const printLetter = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Actions */}
      <div className="flex items-center justify-between rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
        <div className="flex gap-2">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-600/20 transition hover:bg-cyan-500 active:scale-95"
          >
            <Download className="size-4" /> Download PDF
          </button>
          <button
            onClick={printLetter}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 active:scale-95"
          >
            <Printer className="size-4" /> Print
          </button>
        </div>
        <div className="flex gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm dark:bg-slate-900">
                <FileText className="size-5" />
            </div>
        </div>
      </div>

      {/* A4 Preview Container */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50 md:p-12">
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          ref={previewRef}
          className={`mx-auto aspect-[210/297] w-full max-w-[800px] bg-white p-12 shadow-2xl dark:text-slate-900 ${
            data.template === "professional" ? "border-t-[12px] border-cyan-600" : ""
          }`}
          style={{ height: "auto" }}
        >
          {/* Letter Header */}
          <div className="mb-12 flex justify-between">
            <div>
              {data.logo ? (
                 <img src={data.logo} alt="Logo" className="mb-4 h-16 object-contain" />
              ) : (
                <div className="mb-4 flex size-16 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <Building className="size-8" />
                </div>
              )}
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                {data.companyName || "COMPANY NAME"}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</p>
              <p className="text-sm font-bold text-slate-900">{today}</p>
            </div>
          </div>

          <div className="mb-12 text-center">
            <h1 className="inline-block border-b-2 border-slate-900 pb-1 text-xl font-black uppercase tracking-[0.2em] text-slate-900">
              Experience Certificate
            </h1>
          </div>

          {/* Letter Body */}
          <div className="space-y-6 text-base leading-relaxed text-slate-700">
            <p>
              To Whom It May Concern,
            </p>
            
            <p>
              This is to certify that <span className="font-bold text-slate-900">MR. {data.employeeName?.toUpperCase() || '[EMPLOYEE NAME]'}</span> was an employee of <span className="font-bold text-slate-900">{data.companyName || '[COMPANY NAME]'}</span>.
            </p>

            <p>
              During their tenure from <span className="font-bold text-slate-900">{formatLetterDate(data.joiningDate) || '[JOINING DATE]'}</span> to <span className="font-bold text-slate-900">{formatLetterDate(data.endingDate) || '[ENDING DATE]'}</span>, totaling a period of <span className="font-bold text-slate-900">{duration || '[DURATION]'}</span>, they served in the position of <span className="font-bold text-slate-900">{data.role || '[POSITION]'}</span>.
            </p>

            <p>
              During this period, their performance was found to be <span className="font-bold text-slate-900">{data.performance}</span>. They demonstrated professional conduct and made significant contributions to our organization.
            </p>

            {data.remarks && (
              <p>{data.remarks}</p>
            )}

            <p>
              We found them to be hardworking, dedicated and honest in their professional duties. We wish them all the best for their future endeavors.
            </p>
          </div>

          {/* Footer / Signature */}
          <div className="mt-24 flex justify-between items-end">
            <div className="space-y-1">
               <div className="h-[2px] w-48 bg-slate-200"></div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stamp</p>
            </div>
            <div className="text-right">
              {data.signature ? (
                <img src={data.signature} alt="Signature" className="ml-auto mb-2 h-16 object-contain" />
              ) : (
                <div className="mb-4 h-16"></div>
              )}
              <div className="h-[2px] w-48 bg-slate-900 ml-auto"></div>
              <p className="mt-2 text-sm font-bold text-slate-900">Authorized Signatory</p>
              <p className="text-xs text-slate-500">{data.companyName || 'Manager'}</p>
            </div>
          </div>
        </motion.div>
        
        {/* Watermark in Preview Only */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5 select-none print:hidden">
            <h1 className="text-8xl font-black -rotate-45 uppercase">Preview</h1>
        </div>
      </div>
    </div>
  );
};

function Building({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
