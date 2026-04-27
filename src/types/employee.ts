export const EMPLOYEE_FORM_ROLES = [
  "Employee",
  "Developer",
  "TL",
  "HR",
  "Admin",
] as const;

export const ACCESS_ROLES = ["Admin", "Employee", "TL", "HR"] as const;

export const WORKING_TYPES = [
  "Full Time",
  "Part Time",
  "Contract",
  "Freelance",
  "Intern",
] as const;

export type WorkingType = (typeof WORKING_TYPES)[number];

export const WORKING_MODES = ["Work From Home", "Office"] as const;
export type WorkingMode = (typeof WORKING_MODES)[number];

export const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"] as const;
export type MaritalStatus = (typeof MARITAL_STATUSES)[number];

export const RELATION_TYPES = ["Father", "Mother", "Spouse", "Guardian"] as const;
export type RelationType = (typeof RELATION_TYPES)[number];

export type EmployeeFormRole = (typeof EMPLOYEE_FORM_ROLES)[number];
export type AccessRole = (typeof ACCESS_ROLES)[number];

export type UploadedFileMeta = {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
};

export type EmployeeAddress = {
  currentAddress: string;
  permanentAddress: string;
  workingLocation: string;
};

export type EmployeeAccountDetails = {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId?: string;
  upiHolderName?: string;
};

export type EmployeeDocuments = {
  aadharNumber: string;
  aadharFile?: UploadedFileMeta;
  panNumber?: string;
  panCardFile?: UploadedFileMeta;
  academicDocuments: UploadedFileMeta[];
  experienceLetter?: UploadedFileMeta;
  passportPhoto?: UploadedFileMeta;
  passbookFile?: UploadedFileMeta;
};

export type EmployeeReportingTL = {
  id: string;
  employeeName: string;
  email: string;
};

export type Employee = {
  _id: string;
  employeeName: string;
  mobileNumber: string;
  alternateNumber?: string;
  email: string;
  designation: string;
  role: EmployeeFormRole;
  accessRole: AccessRole;
  workingType: WorkingType;
  workingMode: WorkingMode;
  officeLocation?: string;
  dob: string;
  maritalStatus: MaritalStatus;
  bloodGroup?: string;
  offeredSalary?: number;
  interviewDate?: string;
  joiningDate: string;
  relationType: RelationType;
  relativeName: string;
  address: EmployeeAddress;
  accountDetails: EmployeeAccountDetails;
  documents: EmployeeDocuments;
  reportingTL?: EmployeeReportingTL;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeListResponse = {
  items: Employee[];
};

export type EmployeeStats = {
  total: number;
  roleWise: Record<AccessRole, number>;
  recentEmployees: Employee[];
};
