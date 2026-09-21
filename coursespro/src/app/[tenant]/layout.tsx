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

  const logoUrl = tenant.dark_logo_url || tenant.logo_url;

  const metadata: Metadata = {
    title: {
      template: `%s | ${tenant.name}`,
      default: tenant.name,
    },
    description: tenant.motto || `Welcome to ${tenant.name}`,
  };

  if (logoUrl) {
    metadata.icons = [{ url: logoUrl }];
    metadata.openGraph = {
      images: [logoUrl],
    };
  }

  return metadata;
}

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
