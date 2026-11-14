'use client';

import React from 'react';
import { MessagingDashboard } from '../campus-os/page';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function AdminMessagingPage() {
  return (
    <MotionRise>
      <MessagingDashboard />
    </MotionRise>
  );
}
