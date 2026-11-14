'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export {
  AcademicOperationsHub,
  ParentsDashboard,
  MessagingDashboard,
  MobileAppDashboard,
  useCampusOS,
  CampusOSProvider,
} from './components';

function CampusOSRedirector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const subtabParam = searchParams.get('subtab');

    const validTabs = [
      'academic',
      'staff',
      'students',
      'parents',
      'financials',
      'library',
      'inventory',
      'transportation',
      'admission',
      'messaging',
      'mobile-app',
    ];

    const targetTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'academic';
    const query = subtabParam ? `?subtab=${encodeURIComponent(subtabParam)}` : '';
    router.replace(`/admin/campus-os/${targetTab}${query}`);
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center p-12 text-sm text-gray-400">
      Loading CampusPRO...
    </div>
  );
}

export default function AdminCampusOSPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-400">Loading CampusPRO...</div>}>
      <CampusOSRedirector />
    </Suspense>
  );
}
