export interface SalaryStructure {
  monthlySalary: number;
  totalDays: number;
  unpaidLeaves: number;
  paidLeaves: number;
  bonus: number;
  overtime: number;
  taxPercentage: number;
  otherDeductions: number;
  joiningDate?: string;
  leavingDate?: string;
  enablePF?: boolean;
}

export interface SalaryBreakdown {
  perDaySalary: number;
  workedDays: number;
  actualWorkedDays: number;
  paidLeaves: number;
  paidLeaveEarnings: number;
  grossEarned: number;
  totalBonus: number;
  pfDeduction: number;
  taxDeduction: number;
  totalDeduction: number;
  netSalary: number;
}

export const calculateSalary = (data: SalaryStructure): SalaryBreakdown => {
  const {
    monthlySalary,
    totalDays,
    unpaidLeaves,
    paidLeaves,
    bonus,
    overtime,
    taxPercentage,
    otherDeductions,
    enablePF,
  } = data;

  // 1. Basic Per Day calculation
  const perDaySalary = monthlySalary / (totalDays || 30);

  // 2. Days Logic
  // Actual worked days are days they were actually present
  const actualWorkedDays = Math.max(0, totalDays - unpaidLeaves - paidLeaves);
  // Total payable days include actual worked days + paid leaves
  const workedDays = actualWorkedDays + paidLeaves;

  // 3. Earnings
  const baseEarnings = perDaySalary * actualWorkedDays;
  const paidLeaveEarnings = perDaySalary * paidLeaves;
  const grossEarned = baseEarnings + paidLeaveEarnings;

  // 4. Bonus/Overtime
  const totalBonus = (bonus || 0) + (overtime || 0);

  // 5. Deductions
  const pfDeduction = enablePF ? monthlySalary * 0.12 : 0;
  const taxDeduction = grossEarned * (taxPercentage / 100);
  const totalDeduction = pfDeduction + taxDeduction + (otherDeductions || 0);

  // 6. Final Net Salary
  const netSalary = Math.max(0, grossEarned + totalBonus - totalDeduction);

  return {
    perDaySalary: Number(perDaySalary.toFixed(2)),
    workedDays,
    actualWorkedDays,
    paidLeaves,
    paidLeaveEarnings: Number(paidLeaveEarnings.toFixed(2)),
    grossEarned: Number(grossEarned.toFixed(2)),
    totalBonus,
    pfDeduction: Number(pfDeduction.toFixed(2)),
    taxDeduction: Number(taxDeduction.toFixed(2)),
    totalDeduction: Number(totalDeduction.toFixed(2)),
    netSalary: Number(netSalary.toFixed(2)),
  };
};
