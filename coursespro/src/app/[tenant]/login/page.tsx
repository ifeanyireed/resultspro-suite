import React from 'react';
import { notFound } from 'next/navigation';
import { getTenant } from '@/lib/tenant';
import LoginForm from './LoginForm';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default async function LoginPage({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  const tenant = await getTenant(resolvedParams.tenant);

  if (!tenant) {
    notFound();
  }

  return (
    <MotionRise>
      <LoginForm tenant={tenant} />
    </MotionRise>
  );
}
