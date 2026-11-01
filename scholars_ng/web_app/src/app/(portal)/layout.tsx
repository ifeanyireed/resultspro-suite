'use client';

import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import PortalSidebar from "@/components/PortalSidebar/PortalSidebar";
import PortalHeader from "@/components/PortalHeader/PortalHeader";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModernDashboardLayout
      sidebarContent={<PortalSidebar />}
      headerContent={<PortalHeader />}
    >
      {children}
    </ModernDashboardLayout>
  );
}
