'use client';

import React, { Suspense } from 'react';
import TeacherDashboard from '@/components/Dashboard/TeacherDashboard';
import { MotionRise } from "@/components/ScrollRiseProvider";

export default function TeacherDashboardPage() {
  return (
    <MotionRise>
      <Suspense fallback={<div className="p-12 text-center text-sm text-gray-400">Loading Faculty Command Hub...</div>}>
        <TeacherDashboard />
      </Suspense>
    </MotionRise>
  );
}
