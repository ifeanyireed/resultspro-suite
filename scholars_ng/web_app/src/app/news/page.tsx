'use client';

import Home from '../page';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function NewsPage() {
  return (
    <MotionRise>
      <Home />
    </MotionRise>
  );
}
