"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Role, hasPermission } from "@/lib/roles";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  minRole?: Role;
  fallback?: React.ReactNode;
}

export const RoleGate = ({ 
  children, 
  allowedRoles, 
  minRole, 
  fallback = null 
}: RoleGateProps) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <>{fallback}</>;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  if (minRole && !hasPermission(user.role, minRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
