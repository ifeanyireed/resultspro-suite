import { Metadata } from 'next';
import { getTenant } from '@/lib/tenant';

export async function generateMetadata({ params }: { params: Promise<{ tenant: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const tenant = await getTenant(resolvedParams.tenant);

  if (!tenant) {
    return {
      title: 'Tenant Not Found',
    };
  }

  return {
    title: {
      template: `%s | ${tenant.name}`,
      default: tenant.name,
    },
    description: tenant.motto || `Welcome to ${tenant.name}`,
    icons: tenant.logo_url ? [{ url: tenant.logo_url }] : [],
  };
}

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
