'use client';

import Home from '../page';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function NoticesPage() {
  return (
    <MotionRise>
      <Home />
    </MotionRise>
  );
}
