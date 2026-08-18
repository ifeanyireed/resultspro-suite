"use client";

import { Sidebar } from "@/components/DashboardLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Role } from "@/lib/roles";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      const role = user.role as Role;
      
      // Basic route protection logic
      if (pathname.startsWith("/dashboard/admin") && role !== Role.SCHOOL_ADMIN && role !== Role.SUPERADMIN) {
        router.push("/dashboard");
        return;
      }
      
      if (pathname.startsWith("/dashboard/super-admin") && role !== Role.SUPERADMIN) {
        router.push("/dashboard");
        return;
      }
      
      if (pathname.startsWith("/dashboard/teacher") && role !== Role.TEACHER) {
        router.push("/dashboard");
        return;
      }
      
      if (pathname.startsWith("/dashboard/parent") && role !== Role.PARENT) {
        router.push("/dashboard");
        return;
      }

      setIsAuthorized(true);
    }
  }, [user, isAuthenticated, pathname, router]);

  if (!isAuthenticated || !isAuthorized) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy">
      <Sidebar />
      <div className="pl-64">
        {children}
      </div>
    </div>
  );
}
