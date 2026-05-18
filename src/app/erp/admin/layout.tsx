import { redirect } from "next/navigation";
import { getErpAuth } from "@/lib/erp/auth";
import DashboardShell from "@/components/erp/layout/DashboardShell";
import { 
  LayoutDashboard, Users, Briefcase, 
  CreditCard, FileText, Shield, History
} from "lucide-react";

export const metadata = {
  title: "Admin ERP Dashboard",
  description: "Centralized Management for ERP",
};

const adminNavItems: any[] = [
  { label: "Overview", href: "/erp/admin", icon: "LayoutDashboard" },
  { label: "Franchises", href: "/erp/admin/franchises", icon: "Shield" },
  { label: "Projects", href: "/erp/admin/projects", icon: "Briefcase" },
  { label: "Payments", href: "/erp/admin/payments", icon: "CreditCard" },
  { label: "Invoices", href: "/erp/admin/invoices", icon: "FileText" },
  { label: "Users", href: "/erp/admin/users", icon: "Users" },
  { label: "Audit Logs", href: "/erp/admin/audit", icon: "History" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getErpAuth();

  if (!auth || auth.role !== "ADMIN") {
    redirect("/erp/login?error=unauthorized");
  }

  return (
    <DashboardShell 
      navItems={adminNavItems} 
      role="Admin" 
      userName={auth.email.split("@")[0]}
    >
      {children}
    </DashboardShell>
  );
}
