import React from 'react';
import { getTenant } from '@/lib/tenant';
import StandardContent from '@/app/[tenant]/the-standard/StandardContent';

export default async function PlatformStandardPage({
  searchParams
}: {
  searchParams?: Promise<{ tenant?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const tenantSlug = resolvedSearchParams?.tenant || process.env.NEXT_PUBLIC_TENANT_SLUG || 'skillupacademy';
  const tenant = await getTenant(tenantSlug);

  const activeTenant = tenant || {
    id: 'default_platform',
    slug: tenantSlug,
    name: 'CoursesPRO Academy',
    logo_url: null,
  };

  return <StandardContent tenant={activeTenant} isPlatform={true} />;
}
