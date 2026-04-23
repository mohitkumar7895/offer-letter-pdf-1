"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Upload, Download, FileText, Trash2, Image as ImageIcon } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function OtherDocumentsPage() {
  const [content, setContent] = useState<string>("");
  const [letterheadImage, setLetterheadImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLetterheadImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLetterhead = () => {
    setLetterheadImage(null);
  };

  const generatePDF = async () => {
    if (!documentRef.current) return;
    
    setIsGenerating(true);
    try {
      // Temporarily hide scrollbars or add specific styles for capturing
      const element = documentRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      
      // A4 size in mm: 210 x 297
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Custom_Document.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="min-h-screen flex-1 px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-7 xl:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
        <header className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_15%_10%,rgba(45,212,191,0.16),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.14),transparent_38%)]"
            aria-hidden
          />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">
                Document Center
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Other Documents
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                Create custom documents on your letterhead.
              </p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <label className="relative inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                <Upload className="mr-2 size-4" />
                Upload Letterhead (A4)
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
              
              <button
                onClick={generatePDF}
                disabled={isGenerating || (!content && !letterheadImage)}
                className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="mr-2 size-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <Download className="mr-2 size-4" />
                )}
                Download PDF
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <div className="flex flex-col space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                <FileText className="mr-2 size-5 text-teal-500" />
                Word Editor
              </h3>
            </div>
            
            <div className="flex-1 min-h-[500px] border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 dark:[&_.ql-toolbar]:border-slate-700 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[450px] [&_.ql-editor]:text-base">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                modules={modules}
                placeholder="Type your document content here..."
                className="h-full bg-white dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="flex flex-col space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                <ImageIcon className="mr-2 size-5 text-indigo-500" />
                A4 Preview
              </h3>
              {letterheadImage && (
                <button
                  onClick={removeLetterhead}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-red-950/30 transition-colors"
                  title="Remove Letterhead"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-auto rounded-xl border border-slate-200 bg-slate-200/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 flex justify-center items-start">
              {/* A4 Container (210x297 aspect ratio) */}
              <div 
                ref={documentRef}
                className="relative w-full max-w-[794px] aspect-[210/297] bg-white shadow-xl overflow-hidden"
                style={{
                  backgroundImage: letterheadImage ? `url(${letterheadImage})` : 'none',
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Content Overlay */}
                <div 
                  className="absolute inset-0 p-12 sm:p-16 text-black ql-editor"
                  style={{
                    wordBreak: 'break-word',
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
