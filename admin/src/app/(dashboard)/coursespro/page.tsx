'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CoursesProAdminRoot() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/coursespro/tenants');
  }, [router]);
  return null;
}
