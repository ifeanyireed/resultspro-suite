'use client';

import Home from '../page';
import { MotionRise } from "@/components/ScrollRiseProvider";

export default function TenantPage() {
  return (
    <MotionRise>
      <Home />
    </MotionRise>
  );
}
