import React from 'react';
import { notFound } from 'next/navigation';
import { getTenant } from '@/lib/tenant';
import ApplyForm from './ApplyForm';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default async function ApplyPage({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  const tenant = await getTenant(resolvedParams.tenant);

  if (!tenant) {
    notFound();
  }

  return (
    <MotionRise>
      <ApplyForm tenant={tenant} />
    </MotionRise>
  );
}
