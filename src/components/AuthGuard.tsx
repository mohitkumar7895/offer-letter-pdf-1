"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PageSkeleton } from "@/components/SkeletonLoader";
import type { AccessRole } from "@/types/employee";

type MeResponse = {
  user?: {
    id: string;
    email: string;
    role: AccessRole;
  } | null;
};

let sessionRequest: Promise<MeResponse["user"]> | null = null;
let sessionCache: { user: MeResponse["user"]; fetchedAt: number } | null = null;
const SESSION_CACHE_TTL_MS = 30_000;

const roleRouteMap: Record<AccessRole, string[]> = {
  Admin: ["/dashboard", "/employees", "/offer-letter", "/tls"],
  HR: ["/dashboard", "/employees", "/offer-letter", "/tls"],
  TL: ["/dashboard", "/employees", "/offer-letter", "/tls"],
  Employee: ["/offer-letter"],
};

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const lastPathRef = useRef<string | null>(null);

  const isAuthRoute = useMemo(
    () =>
      pathname === "/login" ||
      pathname === "/register" ||
      pathname.startsWith("/auth"),
    [pathname],
  );

  useEffect(() => {
    if (isAuthRoute) {
      setLoading(false);
    }
  }, [isAuthRoute]);

  useEffect(() => {
    if (isAuthRoute) return;
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;

    let active = true;

    async function validate() {
      try {
        const now = Date.now();
        const cachedUser =
          sessionCache && now - sessionCache.fetchedAt < SESSION_CACHE_TTL_MS
            ? sessionCache.user
            : undefined;

        if (cachedUser !== undefined) {
          if (!cachedUser) {
            router.replace("/login");
            return;
          }
          const allowedRoutes = roleRouteMap[cachedUser.role] || [];
          const allowed = allowedRoutes.some((route) => pathname.startsWith(route));
          if (!allowed) {
            router.replace("/offer-letter");
          }
          return;
        }

        if (!sessionRequest) {
          sessionRequest = (async () => {
            const res = await fetch("/api/auth/me", {
              method: "GET",
              cache: "no-store",
            });
            const data = (await res.json()) as MeResponse;
            if (!res.ok) return null;
            return data.user || null;
          })().finally(() => {
            sessionRequest = null;
          });
        }
        const user = await sessionRequest;
        sessionCache = { user, fetchedAt: Date.now() };
        const responseOk = Boolean(user);

        if (!active) return;

        if (!responseOk || !user) {
          router.replace("/login");
          return;
        }

        const allowedRoutes = roleRouteMap[user.role] || [];
        const allowed = allowedRoutes.some((route) => pathname.startsWith(route));
        if (!allowed) {
          router.replace("/offer-letter");
          return;
        }
      } catch {
        if (active) {
          router.replace("/login");
          return;
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    validate();

    return () => {
      active = false;
    };
  }, [isAuthRoute, pathname, router]);

  if (loading && !isAuthRoute) {
    return <PageSkeleton />;
  }

  return <>{children}</>;
}
