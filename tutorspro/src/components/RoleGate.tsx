"use client";

import { ReactNode } from "react";

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectPath?: string;
}

export function RoleGate({ children }: RoleGateProps) {
  return <>{children}</>;
}
