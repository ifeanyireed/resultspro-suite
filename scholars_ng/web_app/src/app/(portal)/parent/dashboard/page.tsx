'use client';

import React, { Suspense } from 'react';
import ParentDashboard from '@/components/Dashboard/ParentDashboard';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function ParentDashboardPage() {
  return (
    <MotionRise>
      <Suspense fallback={<div className="p-12 text-center text-sm text-gray-400">Loading Guardian Command Hub...</div>}>
        <ParentDashboard />
      </Suspense>
    </MotionRise>
  );
}
