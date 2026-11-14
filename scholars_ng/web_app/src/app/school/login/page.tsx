'use client';

import React from 'react';
import PortalLoginPage from '../../login/page';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function SchoolLoginPage() {
  return (
    <MotionRise>
      <PortalLoginPage />
    </MotionRise>
  );
}
