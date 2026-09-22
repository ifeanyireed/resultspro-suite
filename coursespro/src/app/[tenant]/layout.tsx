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

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const resolvedParams = await params;
  const tenant = await getTenant(resolvedParams.tenant);

  if (!tenant) return <>{children}</>;

  // Dynamically override nets.css hardcoded colors
  const customStyles = `
    :root {
      ${tenant.primary_color ? `--color-nets-navy: ${tenant.primary_color};` : ''}
      ${tenant.secondary_color ? `--color-nets-navy-dark: ${tenant.secondary_color};` : ''}
      ${tenant.accent_color ? `--color-nets-red: ${tenant.accent_color};` : ''}
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      {children}
    </>
  );
}
