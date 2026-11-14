'use client';

import React from 'react';
import AdminPuzzlePROHub from '../puzzlepro/page';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function AdminCohortsPage() {
  return (
    <MotionRise>
      <AdminPuzzlePROHub />
    </MotionRise>
  );
}
