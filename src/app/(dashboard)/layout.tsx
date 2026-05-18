import { cookies } from "next/headers";
import { AppShell } from "@/components/AppShell";
import { getAuthFromCookies } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import CompanySettings from "@/models/CompanySettings";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("ems-theme")?.value;
  const theme = themeCookie === "dark" || themeCookie === "light" ? themeCookie : "light";
  const auth = await getAuthFromCookies();

  await connectDB();
  const settings = await CompanySettings.findOne().lean();
  const companyName = settings?.companyName || "Employee manager";
  const companyLogo = settings?.companyLogo?.url || null;

  return (
    <AppShell 
      initialTheme={theme} 
      userRole={auth?.role}
      companyName={companyName}
      companyLogo={companyLogo}
    >
      {children}
    </AppShell>
  );
}
