import React from 'react';
import { getTenant } from '@/lib/tenant';
import VerifyEmailForm from '@/app/[tenant]/verify-email/VerifyEmailForm';

export default async function PlatformVerifyEmailPage() {
  const tenant = await getTenant('coursespro');
  return <VerifyEmailForm tenant={tenant} />;
}
