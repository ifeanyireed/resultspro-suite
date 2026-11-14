import React from 'react';
import { notFound } from 'next/navigation';
import { getTenant } from '@/lib/tenant';
import OrientationForm from './OrientationForm';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default async function OrientationPage({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  const tenant = await getTenant(resolvedParams.tenant);

  if (!tenant) {
    notFound();
  }

  return (
    <MotionRise>
      <OrientationForm tenant={tenant} />
    </MotionRise>
  );
}
