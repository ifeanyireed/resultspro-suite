'use client';

import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import PortalSidebar from "@/components/PortalSidebar/PortalSidebar";
import PortalHeader from "@/components/PortalHeader/PortalHeader";
import { useTenant } from '@/components/TenantProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { AppHostProvider } from '@/components/AppHostContext';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tenant } = useTenant();
  const { user, accessToken } = useAuthStore();

  const hostUser = user ? {
    id: user.id,
    name: user.full_name,
    email: user.email,
    role: user.role,
    avatar_url: user.avatar_url,
    school_id: user.school_id,
    class_id: user.class_id,
  } : null;

  return (
    <AppHostProvider 
      tenant={tenant} 
      user={hostUser} 
      token={accessToken} 
      standalone={false}
    >
      <ModernDashboardLayout
        sidebarContent={<PortalSidebar />}
        headerContent={<PortalHeader />}
      >
        {children}
      </ModernDashboardLayout>
    </AppHostProvider>
  );
}
