'use client';

import SharedLoginPage from '@/components/auth/SharedLoginPage';
import { MotionRise } from '@/components/ScrollRiseProvider';
import { USERS_API } from '@/lib/api';

export default function LoginPage() {
  return (
    <MotionRise>
      <SharedLoginPage 
        appName="Edu Suite"
        appDescription="The Engine Powering Modern Education."
        brandTitle="ResultsPro"
        brandSubtitle="EDU SUITE"
        loginEndpoint={`${USERS_API}/api/v1/auth/login`}
        redirectPath="/onboard" 
      />
    </MotionRise>
  );
}
