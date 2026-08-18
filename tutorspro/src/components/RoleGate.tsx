"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectPath?: string;
}

export function RoleGate({ children, allowedRoles, redirectPath = "/login" }: RoleGateProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectPath);
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      router.push("/unauthorized"); // Or some other safe landing page
    }
  }, [isAuthenticated, user, allowedRoles, router, redirectPath]);

  if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return null; // Or a loading spinner / access denied message
  }

  return <>{children}</>;
}
