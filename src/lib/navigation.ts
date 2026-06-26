import type { AccessRole } from "@/types/employee";

export type NavItem = {
  href: string;
  label: string;
  description?: string;
  kind?: "Flow" | "Record" | "Tool" | "Document";
  roles: AccessRole[];
};

export type NavSection = {
  id: string;
  label: string;
  roles: AccessRole[];
  collapsible?: boolean;
  items: NavItem[];
};

/** Single source of truth — sidebar order & grouping */
export const NAV_SECTIONS: NavSection[] = [
  {
    id: "overview",
    label: "Overview",
    roles: ["Admin", "HR", "TL", "Employee"],
    items: [
      { href: "/dashboard", label: "Dashboard", description: "Quick summary & latest records", kind: "Tool", roles: ["Admin", "HR", "TL"] },
      { href: "/employee-dashboard", label: "My Dashboard", description: "My assigned tasks & updates", kind: "Flow", roles: ["Employee"] },
      { href: "/tl-dashboard", label: "TL Dashboard", description: "My team, tasks & progress", kind: "Flow", roles: ["TL"] },
      { href: "/business-flow", label: "Business Flow", description: "See how modules connect", kind: "Flow", roles: ["Admin", "HR"] },
      { href: "/analytics", label: "Analytics", description: "Business KPIs & charts", kind: "Tool", roles: ["Admin", "HR"] },
      { href: "/service-dashboard", label: "Service Dashboard", description: "Customer service metrics", kind: "Tool", roles: ["Admin", "HR"] },
    ],
  },
  {
    id: "people",
    label: "People & HR",
    roles: ["Admin", "HR", "TL"],
    items: [
      { href: "/employees", label: "Employees", description: "Main staff master record", kind: "Record", roles: ["Admin", "HR", "TL"] },
      { href: "/tls", label: "TL Management", description: "TL wise employee teams", kind: "Flow", roles: ["Admin", "HR"] },
      { href: "/attendance", label: "Salary Calculator", description: "Quick monthly estimate only", kind: "Tool", roles: ["Admin", "HR"] },
      { href: "/salary", label: "Salary Records", description: "Actual payroll/payment records", kind: "Record", roles: ["Admin", "HR"] },
    ],
  },
  {
    id: "sales",
    label: "Sales & Customers",
    roles: ["Admin", "HR"],
    items: [
      { href: "/clients", label: "Customers", description: "Customer master & profile", kind: "Record", roles: ["Admin", "HR"] },
      { href: "/sales/leads", label: "Sales Leads", description: "Lead to customer pipeline", kind: "Flow", roles: ["Admin", "HR"] },
    ],
  },
  {
    id: "projects",
    label: "Projects & Delivery",
    roles: ["Admin", "HR", "TL"],
    items: [
      { href: "/projects", label: "Projects", description: "Customer work + linked domain/payment", kind: "Flow", roles: ["Admin", "HR", "TL"] },
      { href: "/staff-allocation", label: "Staff Allocation", description: "Who works on which project", kind: "Flow", roles: ["Admin", "HR", "TL"] },
      { href: "/milestones", label: "Milestones", description: "Project deadlines & progress", kind: "Record", roles: ["Admin", "HR", "TL"] },
      { href: "/tasks", label: "Tasks", description: "Daily work tracking", kind: "Record", roles: ["Admin", "HR", "TL", "Employee"] },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    roles: ["Admin", "HR"],
    items: [
      { href: "/payments", label: "Customer Invoices", description: "Customer expected/received payments", kind: "Record", roles: ["Admin", "HR"] },
      { href: "/payment-ledger", label: "Payment Ledger", description: "Money in, due, salary & expenses", kind: "Flow", roles: ["Admin", "HR"] },
      { href: "/service-charges", label: "Service Charges", description: "Fees, GST & discounts", kind: "Record", roles: ["Admin", "HR"] },
      { href: "/staff-expenses", label: "Staff Expenses", description: "Employee reimbursements", kind: "Record", roles: ["Admin", "HR", "TL", "Employee"] },
      { href: "/office-expenses", label: "Office Expenses", description: "Rent, utilities, supplies", kind: "Record", roles: ["Admin", "HR"] },
      { href: "/purchases", label: "Purchasing", description: "Purchase requests & assets", kind: "Flow", roles: ["Admin", "HR"] },
    ],
  },
  {
    id: "service",
    label: "Service & Assets",
    roles: ["Admin", "HR", "TL"],
    items: [
      { href: "/maintenance", label: "Maintenance", description: "Project service/AMC records", kind: "Record", roles: ["Admin", "HR", "TL"] },
      { href: "/renewals", label: "Renewals", description: "Upcoming renewals to collect/follow", kind: "Record", roles: ["Admin", "HR"] },
      { href: "/domains", label: "Domains", description: "Domain tied to customer/project", kind: "Record", roles: ["Admin", "HR"] },
      { href: "/assets", label: "Company Assets", description: "Internal assets inventory", kind: "Record", roles: ["Admin", "HR"] },
    ],
  },
  {
    id: "documents",
    label: "Documents",
    roles: ["Admin", "HR", "TL"],
    collapsible: true,
    items: [
      { href: "/offer-letter", label: "Offer Letter", description: "Create & manage offer PDFs", kind: "Document", roles: ["Admin", "HR", "TL"] },
      { href: "/experience-letter", label: "Experience Letter", description: "Experience certificates", kind: "Document", roles: ["Admin", "HR", "TL"] },
      { href: "/other", label: "Other Documents", description: "Custom document editor", kind: "Document", roles: ["Admin", "HR"] },
    ],
  },
  {
    id: "system",
    label: "System",
    roles: ["Admin", "HR", "TL", "Employee"],
    items: [
      { href: "/notifications", label: "Notifications", description: "Alerts & reminders", kind: "Tool", roles: ["Admin", "HR", "TL", "Employee"] },
      { href: "/reports", label: "Reports", description: "Export all records", kind: "Tool", roles: ["Admin", "HR"] },
      { href: "/login-sessions", label: "Login Sessions", description: "Online users & portal duration", kind: "Tool", roles: ["Admin", "HR"] },
      { href: "/settings", label: "Settings", description: "Company, roles, module guide", kind: "Tool", roles: ["Admin", "HR"] },
    ],
  },
];

export function getVisibleSections(role: AccessRole | undefined): NavSection[] {
  if (!role) return [];
  return NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => item.roles.includes(role)),
  })).filter((section) => section.roles.includes(role) && section.items.length > 0);
}

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function findNavItem(pathname: string, role: AccessRole | undefined) {
  if (!role) return null;
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (item.roles.includes(role) && isNavActive(pathname, item.href)) {
        return { section, item };
      }
    }
  }
  return null;
}

/** Business module registry — route, API, labels aligned */
export const MODULE_REGISTRY = {
  leads: { route: "/sales/leads", api: "/api/sales/leads", title: "Sales Leads", section: "Sales & Customers" },
  businessFlow: { route: "/business-flow", api: "/api/dashboard/stats", title: "Business Flow", section: "Overview" },
  customers: { route: "/clients", api: "/api/clients", title: "Customers", section: "Sales & Customers" },
  projects: { route: "/projects", api: "/api/projects", title: "Projects", section: "Projects & Delivery" },
  staffAllocation: { route: "/staff-allocation", api: "/api/staff-allocations", title: "Staff Allocation", section: "Projects & Delivery" },
  milestones: { route: "/milestones", api: "/api/milestones", title: "Milestones", section: "Projects & Delivery" },
  tls: { route: "/tls", api: "/api/tls/assign", title: "TL Management", section: "People & HR" },
  tasks: { route: "/tasks", api: "/api/tasks", title: "Tasks", section: "Projects & Delivery" },
  payments: { route: "/payments", api: "/api/payments", title: "Payments", section: "Finance" },
  paymentLedger: { route: "/payment-ledger", api: "/api/payment-ledger", title: "Payment Ledger", section: "Finance" },
  serviceCharges: { route: "/service-charges", api: "/api/service-charges", title: "Service Charges", section: "Finance" },
  staffExpenses: { route: "/staff-expenses", api: "/api/staff-expenses", title: "Staff Expenses", section: "Finance" },
  officeExpenses: { route: "/office-expenses", api: "/api/office-expenses", title: "Office Expenses", section: "Finance" },
  purchases: { route: "/purchases", api: "/api/purchases", title: "Purchasing", section: "Finance" },
  salary: { route: "/salary", api: "/api/salary", title: "Salary Records", section: "People & HR" },
  maintenance: { route: "/maintenance", api: "/api/maintenance", title: "Maintenance", section: "Service & Assets" },
  renewals: { route: "/renewals", api: "/api/renewals", title: "Renewals", section: "Service & Assets" },
  domains: { route: "/domains", api: "/api/domains", title: "Domains", section: "Service & Assets" },
  assets: { route: "/assets", api: "/api/assets", title: "Company Assets", section: "Service & Assets" },
  notifications: { route: "/notifications", api: "/api/notifications", title: "Notifications", section: "System" },
  reports: { route: "/reports", api: "/api/reports", title: "Reports", section: "System" },
  analytics: { route: "/analytics", api: "/api/dashboard/stats", title: "Analytics", section: "Overview" },
  serviceDashboard: { route: "/service-dashboard", api: "/api/dashboard/stats", title: "Service Dashboard", section: "Overview" },
  employeeDashboard: { route: "/employee-dashboard", api: "/api/tasks", title: "My Dashboard", section: "Overview" },
  tlDashboard: { route: "/tl-dashboard", api: "/api/tl-dashboard", title: "TL Dashboard", section: "Overview" },
  loginSessions: { route: "/login-sessions", api: "/api/login-sessions", title: "Login Sessions", section: "System" },
} as const;

export const DOCUMENT_MODULES = {
  offerLetter: { route: "/offer-letter", api: "/api/pdfs", fileApi: "/api/pdfs", title: "Offer Letter", section: "Documents" },
  experienceLetter: { route: "/experience-letter", api: "/api/experience-letters", fileApi: "/api/experience-letters", title: "Experience Letter", section: "Documents" },
  other: { route: "/other", api: "/api/other-documents", fileApi: "/api/other-documents", title: "Other Documents", section: "Documents" },
} as const;

export function getModuleByRoute(route: string) {
  return Object.values(MODULE_REGISTRY).find((m) => m.route === route);
}

export function moduleBreadcrumbs(route: string) {
  const mod = getModuleByRoute(route);
  if (!mod) {
    return [{ label: "Dashboard", href: "/dashboard" }];
  }
  return [
    { label: "Dashboard", href: "/dashboard" },
    { label: mod.section },
    { label: mod.title },
  ];
}

export function documentBreadcrumbs(key: keyof typeof DOCUMENT_MODULES) {
  const mod = DOCUMENT_MODULES[key];
  return [
    { label: "Dashboard", href: "/dashboard" },
    { label: mod.section },
    { label: mod.title },
  ];
}
