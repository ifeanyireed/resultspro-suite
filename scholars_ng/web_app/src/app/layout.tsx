import type { Metadata } from "next";
import { headers } from "next/headers";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";

import { TenantProvider } from "../components/TenantProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

async function getTenant(host: string, slugHeader?: string | null) {
  const hostname = host.split(':')[0].toLowerCase();
  const platformDomain = (process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'scholars.ng').toLowerCase();
  
  // Apex platform has no school tenant (serves commercial ScholarsNG landing)
  if (
    hostname === platformDomain ||
    hostname === `www.${platformDomain}` ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === 'scholars.local'
  ) {
    return null;
  }

  // Determine lookup key from slug header or hostname
  let searchDomain = slugHeader || '';
  if (!searchDomain) {
    if (hostname.endsWith('.localhost')) {
      searchDomain = hostname.replace('.localhost', '');
    } else if (hostname.endsWith(`.${platformDomain}`)) {
      searchDomain = hostname.replace(`.${platformDomain}`, '');
    } else if (hostname.endsWith('.resultspro.ng')) {
      searchDomain = hostname.replace('.resultspro.ng', '');
    } else {
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

  if (!tenant) {
    return {
      title: "ScholarsNG — The Digital Campus Operating System",
      description: "Institutional infrastructure and unified learning portal connecting schools, teachers, parents, and students.",
      icons: {
        icon: '/icon.png',
        apple: '/icon.png',
      }
    };
  }

  return {
    title: `${tenant.name} | Scholars Workspace`,
    description: `Official institutional workspace and admission portal for ${tenant.name}.`,
    icons: {
      icon: tenant.logo_url || '/icon.png',
      apple: tenant.logo_url || '/icon.png',
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
      <body suppressHydrationWarning className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
        <TenantProvider tenant={tenant}>
          {children}
        </TenantProvider>
      </body>
    </html>
  );
}
