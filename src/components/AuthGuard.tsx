"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { NAV_SECTIONS } from "@/lib/navigation";
import type { AccessRole } from "@/types/employee";

function getAllowedPrefixes(role: AccessRole): string[] {
  const prefixes = new Set<string>();
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (item.roles.includes(role)) {
        prefixes.add(item.href);
      }
    }
  }
  return Array.from(prefixes);
}

function isPathAllowed(pathname: string, role: AccessRole): boolean {
  return getAllowedPrefixes(role).some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function defaultRouteForRole(role: AccessRole): string {
  if (role === "Employee") return "/employee-dashboard";
  if (role === "TL") return "/tl-dashboard";
  return "/dashboard";
}

function ContentSpinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div
        className="size-8 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent"
        aria-label="Loading"
      />
    </div>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const isAuthRoute =
    pathname === "/login" || pathname === "/register" || pathname.startsWith("/auth");

  useEffect(() => {
    if (isAuthRoute || loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!isPathAllowed(pathname, user.role)) {
      router.replace(defaultRouteForRole(user.role));
    }
  }, [isAuthRoute, loading, pathname, router, user]);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (loading && !user) {
    return <ContentSpinner />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
