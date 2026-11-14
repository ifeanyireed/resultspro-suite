import React from 'react';
import { getTenant } from '@/lib/tenant';
import VerifyEmailForm from '@/app/[tenant]/verify-email/VerifyEmailForm';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default async function PlatformVerifyEmailPage() {
  const tenant = await getTenant('coursespro');
  return (
    <MotionRise>
      <VerifyEmailForm tenant={tenant} />
    </MotionRise>
  );
}
