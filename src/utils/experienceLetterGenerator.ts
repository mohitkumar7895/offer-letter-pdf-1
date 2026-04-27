import { format, differenceInYears, differenceInMonths, parseISO } from "date-fns";

export interface ExperienceLetterData {
  employeeName: string;
  companyName: string;
  role: string;
  joiningDate: string;
  endingDate: string;
  performance: string;
  remarks?: string;
  template: "simple" | "professional";
  logo?: string;
  signature?: string;
  companyAddress?: string;
  companyMobile?: string;
  companyEmail?: string;
  companyWebsite?: string;
  showCompanyName?: boolean;
  showCompanyAddress?: boolean;
  showCompanyMobile?: boolean;
  showCompanyEmail?: boolean;
  showCompanyWebsite?: boolean;
  showCompanyLogo?: boolean;
  authorizedSignatory?: "Director" | "HR" | "None";
}

export const calculateDuration = (joiningDate: string, endingDate: string): string => {
  if (!joiningDate || !endingDate) return "";

  try {
    const start = parseISO(joiningDate);
    const end = parseISO(endingDate);

    if (end < start) return "Invalid date range";

    const years = differenceInYears(end, start);
    const months = differenceInMonths(end, start) % 12;

    const parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);

    if (parts.length === 0) {
        // Less than a month
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return `${days} day${days > 1 ? "s" : ""}`;
    }

    return parts.join(" and ");
  } catch (error) {
    return "";
  }
};

export const formatLetterDate = (dateString: string): string => {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "do MMMM, yyyy");
  } catch (error) {
    return dateString;
  }
};
