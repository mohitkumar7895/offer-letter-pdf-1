"use client";

import React, { useState, useEffect } from "react";
import { ExperienceLetterData } from "@/utils/experienceLetterGenerator";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Building, Briefcase, Calendar, Star, MessageSquare, Image as ImageIcon, Check } from "lucide-react";
import type { Employee } from "@/types/employee";

interface Props {
  data: ExperienceLetterData;
  onChange: (newData: ExperienceLetterData) => void;
}

export const ExperienceForm: React.FC<Props> = ({ data, onChange }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employees");
        const json = await res.json();
        if (json.items) setEmployees(json.items);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const selectEmployee = (emp: Employee) => {
    onChange({
      ...data,
      employeeName: emp.employeeName,
      role: emp.designation,
      joiningDate: emp.createdAt ? emp.createdAt.split("T")[0] : "", // Using createdAt as joining date if not specified elsewhere
    });
    setSearch(emp.employeeName);
    setShowDropdown(false);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  const inputClass =
    "mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-cyan-500 dark:focus:bg-slate-900";

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 rounded-[2rem] border border-slate-200 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Experience Details</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Fill in the details for the experience letter</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => onChange({...data, template: 'simple'})}
             className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${data.template === 'simple' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
           >
             Simple
           </button>
           <button 
             onClick={() => onChange({...data, template: 'professional'})}
             className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${data.template === 'professional' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
           >
             Professional
           </button>
        </div>
      </div>

      {/* Employee Search */}
      <motion.div variants={itemVariants} className="relative">
        <label className="block">
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <Search className="size-4 text-cyan-500" /> Auto-fill from Employee Data
          </span>
          <div className="relative">
            <input
              type="text"
              placeholder="Search employee name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className={inputClass}
            />
            <AnimatePresence>
              {showDropdown && search && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                >
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <button
                        key={emp._id}
                        onClick={() => selectEmployee(emp)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <div className="flex size-8 items-center justify-center rounded-full bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300 font-bold text-xs">
                          {emp.employeeName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold dark:text-white">{emp.employeeName}</p>
                          <p className="text-[10px] text-slate-500">{emp.designation} • {emp.email}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-slate-500">No employees found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </label>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <User className="size-4 text-slate-400" /> Employee Name
            </span>
            <input
              type="text"
              name="employeeName"
              value={data.employeeName}
              onChange={handleChange}
              placeholder="Full Name"
              className={inputClass}
            />
          </label>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <Building className="size-4 text-slate-400" /> Company Name
            </span>
            <input
              type="text"
              name="companyName"
              value={data.companyName}
              onChange={handleChange}
              placeholder="e.g. Acme Corp"
              className={inputClass}
            />
          </label>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <Briefcase className="size-4 text-slate-400" /> Role / Position
            </span>
            <input
              type="text"
              name="role"
              value={data.role}
              onChange={handleChange}
              placeholder="e.g. Senior Developer"
              className={inputClass}
            />
          </label>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <Star className="size-4 text-slate-400" /> Performance
            </span>
            <select
              name="performance"
              value={data.performance}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Excellent">Excellent</option>
              <option value="Very Good">Very Good</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Satisfactory">Satisfactory</option>
            </select>
          </label>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <Calendar className="size-4 text-slate-400" /> Joining Date
            </span>
            <input
              type="date"
              name="joiningDate"
              value={data.joiningDate}
              onChange={handleChange}
              className={inputClass}
            />
          </label>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <Calendar className="size-4 text-slate-400" /> Ending Date
            </span>
            <input
              type="date"
              name="endingDate"
              value={data.endingDate}
              onChange={handleChange}
              className={inputClass}
            />
          </label>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <label className="block">
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <MessageSquare className="size-4 text-slate-400" /> Additional Remarks (Optional)
          </span>
          <textarea
            name="remarks"
            value={data.remarks}
            onChange={handleChange}
            placeholder="Add any specific achievements or remarks..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </label>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={itemVariants}>
           <label className="block">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <ImageIcon className="size-4 text-slate-400" /> Company Logo (URL)
              </span>
              <input 
                type="text"
                name="logo"
                value={data.logo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className={inputClass}
              />
           </label>
        </motion.div>
        <motion.div variants={itemVariants}>
           <label className="block">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <ImageIcon className="size-4 text-slate-400" /> Signature (URL)
              </span>
              <input 
                type="text"
                name="signature"
                value={data.signature}
                onChange={handleChange}
                placeholder="https://example.com/sig.png"
                className={inputClass}
              />
           </label>
        </motion.div>
      </div>
    </motion.div>
  );
};
