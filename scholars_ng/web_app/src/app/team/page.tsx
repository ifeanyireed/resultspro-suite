'use client';

import Home from '../page';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function TeamPage() {
  return (
    <MotionRise>
      <Home />
    </MotionRise>
  );
}
