import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTenant } from '@/lib/tenant';
import './globals.css';
import "./nets.css";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const slug = host.split('.')[0];
  
  let tenantName = 'CoursesPRO';
  
  if (slug && slug !== 'localhost' && slug !== 'coursespro') {
    const tenant = await getTenant(slug);
    if (tenant && tenant.name) {
      tenantName = tenant.name;
    } else {
      tenantName = slug.charAt(0).toUpperCase() + slug.slice(1);
    }
  }

  return {
    title: `${tenantName} — Cohort Learning & Mentor Operating System`,
    description: 'Cohort-based learning operating system with 7-stage journeys, live presence, and mentor reviews',
  };
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
