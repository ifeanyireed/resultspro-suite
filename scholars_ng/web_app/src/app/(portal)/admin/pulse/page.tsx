'use client';

import PrincipalDashboard from '@/components/Dashboard/PrincipalDashboard';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function SchoolPulsePage() {
  return (
    <MotionRise>
      <PrincipalDashboard />
    </MotionRise>
  );
}
