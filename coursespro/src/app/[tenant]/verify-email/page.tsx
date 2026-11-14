import React from 'react';
import { notFound } from 'next/navigation';
import { getTenant } from '@/lib/tenant';
import VerifyEmailForm from './VerifyEmailForm';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default async function VerifyEmailPage({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  const tenant = await getTenant(resolvedParams.tenant);

  if (!tenant) {
    notFound();
  }

  return (
    <MotionRise>
      <VerifyEmailForm tenant={tenant} />
    </MotionRise>
  );
}
