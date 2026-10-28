import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTenant } from '@/lib/tenant';
import './globals.css';
import "./nets.css";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const hostname = host.split(':')[0];
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'localhost';
  const isCustomDomain = !hostname.includes(platformDomain) && !hostname.includes('localhost') && !hostname.includes('onrender.com');
  const slug = isCustomDomain ? hostname : hostname.split('.')[0];
  
  let tenantName = 'CoursesPRO';
  let logoUrl = '';
  
  if (slug && slug !== 'localhost' && slug !== 'coursespro' && slug !== platformDomain) {
    const tenant = await getTenant(slug);
    if (tenant) {
      if (tenant.name) tenantName = tenant.name;
      logoUrl = tenant.dark_logo_url || tenant.logo_url || '';
    } else {
      tenantName = slug.charAt(0).toUpperCase() + slug.slice(1);
    }
  }

  const metadata: Metadata = {
    title: `${tenantName} — Cohort Learning & Mentor Operating System`,
    description: 'Cohort-based learning operating system with 7-stage journeys, live presence, and mentor reviews',
  };

  if (logoUrl) {
    metadata.icons = [{ url: logoUrl }];
    metadata.openGraph = {
      images: [logoUrl],
    };
  }

  return metadata;
}

import QueryProvider from '@/components/providers/QueryProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
