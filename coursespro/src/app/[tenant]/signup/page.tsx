import React from 'react';
import { notFound } from 'next/navigation';
import { getTenant } from '@/lib/tenant';
import SignupForm from './SignupForm';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default async function SignupPage({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  const tenant = await getTenant(resolvedParams.tenant);

  if (!tenant) {
    notFound();
  }

  return (
    <MotionRise>
      <SignupForm tenant={tenant} />
    </MotionRise>
  );
}
