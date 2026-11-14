import React from 'react';
import { notFound } from 'next/navigation';
import { getTenant } from '@/lib/tenant';
import PlanForm from './PlanForm';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default async function PlanPage({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  const tenant = await getTenant(resolvedParams.tenant);

  if (!tenant) {
    notFound();
  }

  return (
    <MotionRise>
      <PlanForm tenant={tenant} />
    </MotionRise>
  );
}
