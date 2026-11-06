import React from 'react';
import { notFound } from 'next/navigation';
import PublicPortfolioPage from '@/app/[tenant]/portfolio/[username]/page';

export const dynamic = 'force-dynamic';

export default async function PlatformPublicPortfolio({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = await params;
  const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || 'coursespro';

  return (
    <PublicPortfolioPage
      params={Promise.resolve({
        tenant: tenantSlug,
        username: resolvedParams.username,
      })}
    />
  );
}
