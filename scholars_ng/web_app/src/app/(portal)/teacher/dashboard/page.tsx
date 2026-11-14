'use client';

import TeacherDashboard from '@/components/Dashboard/TeacherDashboard';
import { MotionRise } from "@/components/ScrollRiseProvider";

export default function TeacherDashboardPage() {
  return (
    <MotionRise>
      <TeacherDashboard />
    </MotionRise>
  );
}
