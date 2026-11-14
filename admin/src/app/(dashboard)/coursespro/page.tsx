'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

export default function CoursesProAdminRoot() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/coursespro/tenants');
  }, [router]);
  return (
    <MotionStagger className="w-full">
      <MotionRise />
    </MotionStagger>
  );
}
