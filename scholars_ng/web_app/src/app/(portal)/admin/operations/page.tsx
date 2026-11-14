'use client';

import React from 'react';
import AdminCampusOSPage from '../campus-os/page';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function AdminOperationsPage() {
  return (
    <MotionRise>
      <AdminCampusOSPage />
    </MotionRise>
  );
}
