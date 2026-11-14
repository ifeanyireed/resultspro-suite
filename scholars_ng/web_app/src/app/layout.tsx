import type { Metadata } from "next";
import { headers, cookies } from "next/headers";
import "./globals.css";

import { TenantProvider } from "../components/TenantProvider";

const FALLBACK_TENANT_CATALOG: Record<
  string,
  {
    id: string;
    name: string;
    slug: string;
    motto: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    default_subdomain: string;
    custom_domain?: string;
    contact_email: string;
    full_address: string;
  }
> = {
  greenwoodhigh: {
    id: 'tenant-greenwoodhigh',
    name: 'Greenwood High Academy',
    slug: 'greenwoodhigh',
    motto: 'Nurturing Future Scholars & Leaders for Global Excellence',
    primary_color: '#146ef5',
    secondary_color: '#0D1060',
    accent_color: '#fbbc04',
    default_subdomain: 'greenwoodhigh.scholars.ng',
    custom_domain: 'portal.greenwoodhigh.edu.ng',
    contact_email: 'admissions@greenwoodhigh.scholars.ng',
    full_address: 'Plot 14 Admiralty Way, Lekki Phase 1, Lagos',
  },
  royalcrown: {
    id: 'tenant-royalcrown',
    name: 'Royal Crown International College',
    slug: 'royalcrown',
    motto: 'Character, Scientific Inquiry & Academic Distinction',
    primary_color: '#0f766e',
    secondary_color: '#042f2e',
    accent_color: '#f59e0b',
    default_subdomain: 'royalcrown.scholars.ng',
    custom_domain: 'portal.royalcrowncollege.edu.ng',
    contact_email: 'registrar@royalcrown.scholars.ng',
    full_address: '28 Isaac John Street, Ikeja GRA, Lagos',
  },
  lagosbritish: {
    id: 'tenant-lagosbritish',
    name: 'Lagos British & STEM Academy',
    slug: 'lagosbritish',
    motto: 'Cambridge Excellence Meets African Innovation',
    primary_color: '#7c3aed',
    secondary_color: '#2e1065',
    accent_color: '#ec4899',
    default_subdomain: 'lagosbritish.scholars.ng',
    custom_domain: 'portal.lagosbritish.sc.ng',
    contact_email: 'admissions@lagosbritish.scholars.ng',
    full_address: 'Victoria Island Annex, Lagos',
  },
};

function buildFallbackTenantFromSlug(slugOrDomain: string) {
  const clean = slugOrDomain.toLowerCase().trim();
  if (FALLBACK_TENANT_CATALOG[clean]) {
    return FALLBACK_TENANT_CATALOG[clean];
  }
  const humanized = clean
    .replace(/\..*$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    id: `tenant-${clean}`,
    name: `${humanized} Academy`,
    slug: clean,
    motto: `Official Digital Campus & Academic Portal for ${humanized} Academy`,
    primary_color: '#146ef5',
    secondary_color: '#0D1060',
    accent_color: '#fbbc04',
    default_subdomain: `${clean}.scholars.ng`,
    contact_email: `admissions@${clean}.scholars.ng`,
    full_address: 'Lagos, Nigeria',
  };
}

async function getTenant(host: string, slugHeader?: string | null, tenantIdHeader?: string | null, isTenantHeader?: string | null) {
  const rawHostname = host.split(':')[0].toLowerCase().trim();
  const hostname = rawHostname.startsWith('www.') ? rawHostname.slice(4) : rawHostname;
  const platformDomain = (process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'scholars.ng').toLowerCase();

  let searchDomain = '';
  if (isTenantHeader === 'true' && slugHeader) {
    searchDomain = slugHeader;
  } else if (hostname.endsWith('.localhost')) {
    searchDomain = hostname.replace(/\.localhost$/, '');
  } else if (hostname.endsWith('.scholars.local')) {
    searchDomain = hostname.replace(/\.scholars\.local$/, '');
  } else if (hostname.endsWith(`.${platformDomain}`)) {
    searchDomain = hostname.replace(new RegExp(`\\.${platformDomain.replace('.', '\\.')}$`), '');
  } else if (hostname.endsWith('.scholars.ng')) {
    searchDomain = hostname.replace(/\.scholars\.ng$/, '');
  } else if (hostname.endsWith('.resultspro.ng')) {
    searchDomain = hostname.replace(/\.resultspro\.ng$/, '');
  } else if (
    hostname &&
    hostname !== 'localhost' &&
    hostname !== '127.0.0.1' &&
    hostname !== 'scholars.local' &&
    hostname !== platformDomain &&
    hostname !== 'scholars.ng' &&
    hostname !== 'resultspro.ng' &&
    !hostname.endsWith('.vercel.app') &&
    !hostname.endsWith('.onrender.com')
  ) {
    searchDomain = rawHostname;
  }

  if (!searchDomain) return null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com'}/api`;
    const res = await fetch(`${apiUrl}/public/tenant/resolve?domain=${encodeURIComponent(searchDomain)}`, { 
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.tenant) {
        return data.tenant;
      }
    }
  } catch (err) {
    console.error("Failed to resolve tenant from API, using slug-resolved tenant profile:", err);
  }

  return buildFallbackTenantFromSlug(searchDomain);
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || '';
  const tenantSlug = headersList.get('x-tenant-slug');
  const tenantId = headersList.get('x-tenant-id');
  const isTenant = headersList.get('x-is-tenant');
  const tenant = await getTenant(host, tenantSlug, tenantId, isTenant);
  const schoolName = tenant?.name || 'ScholarsNG Multi-Tenant Cloud';

  return {
    title: tenant ? `${schoolName} | Official School Portal` : `ScholarsNG | Multi-Tenant School OS & Subdomain Hub`,
    description: tenant?.motto || `Multi-tenant school operating system, subdomain router, and digital campus suite.`,
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
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || '';
  const tenantSlug = headersList.get('x-tenant-slug');
  const tenantId = headersList.get('x-tenant-id');
  const isTenant = headersList.get('x-is-tenant');
  const tenant = await getTenant(host, tenantSlug, tenantId, isTenant);

  const themeVars = tenant ? {
    '--primary': tenant.primary_color || '#2563eb',
    '--secondary': tenant.secondary_color || '#1e40af',
    '--accent': tenant.accent_color || '#3b82f6',
  } as React.CSSProperties : {};

  return (
    <html lang="en" style={themeVars} data-tenant-id={tenant?.id || ''} data-tenant-slug={tenant?.slug || ''} suppressHydrationWarning>
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
