import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

import { TenantProvider } from "../components/TenantProvider";

async function getTenant(host: string, slugHeader?: string | null) {
  const hostname = host.split(':')[0].toLowerCase();
  const platformDomain = (process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'scholars.ng').toLowerCase();

  let searchDomain = slugHeader || '';
  if (!searchDomain) {
    if (hostname.endsWith('.localhost')) {
      searchDomain = hostname.replace('.localhost', '');
    } else if (hostname.endsWith(`.${platformDomain}`)) {
      searchDomain = hostname.replace(`.${platformDomain}`, '');
    } else if (hostname.endsWith('.resultspro.ng')) {
      searchDomain = hostname.replace('.resultspro.ng', '');
    } else if (
      hostname !== 'localhost' &&
      hostname !== '127.0.0.1' &&
      hostname !== 'scholars.local' &&
      hostname !== platformDomain &&
      hostname !== `www.${platformDomain}`
    ) {
      searchDomain = hostname;
    }
  }

  if (!searchDomain) return null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com'}/api`;
    const res = await fetch(`${apiUrl}/public/tenant/resolve?domain=${encodeURIComponent(searchDomain)}`, { 
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.tenant || null;
  } catch (err) {
    console.error("Failed to resolve tenant:", err);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const tenantSlug = headersList.get('x-tenant-slug');
  const tenant = await getTenant(host, tenantSlug);
  const schoolName = tenant?.name || 'My School Academy';

  return {
    title: `${schoolName} | Scholars Workspace`,
    description: `Official institutional workspace and admission portal for ${schoolName}.`,
    icons: {
      icon: tenant?.logo_url || '/icon.png',
      apple: tenant?.logo_url || '/icon.png',
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const tenantSlug = headersList.get('x-tenant-slug');
  const tenant = await getTenant(host, tenantSlug);

  const themeVars = tenant ? {
    '--primary': tenant.primary_color || '#2563eb',
    '--secondary': tenant.secondary_color || '#1e40af',
    '--accent': tenant.accent_color || '#3b82f6',
  } as React.CSSProperties : {};

  return (
    <html lang="en" style={themeVars} suppressHydrationWarning>
      <head>
        <link rel="icon" href={tenant?.logo_url || "/icon.png"} />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <TenantProvider tenant={tenant}>
          {children}
        </TenantProvider>
      </body>
    </html>
  );
}
