'use client';

import StudentDashboard from '@/components/Dashboard/StudentDashboard';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function StudentDashboardPage() {
  return (
    <MotionRise>
      <StudentDashboard />
    </MotionRise>
  );
}
