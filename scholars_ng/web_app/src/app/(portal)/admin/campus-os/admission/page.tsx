'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdmissionsDashboard, { type AdmissionSubtab } from '@/components/Dashboard/AdmissionsDashboard';

function AdmissionContent() {
  const searchParams = useSearchParams();
  const subtabParam = searchParams.get('subtab') as AdmissionSubtab | null;
  const validSubtabs: AdmissionSubtab[] = ['overview', 'inquiries', 'applications', 'pipeline'];
  const initialSubtab = subtabParam && validSubtabs.includes(subtabParam) ? subtabParam : 'overview';

  return <AdmissionsDashboard initialSubtab={initialSubtab} />;
}

export default function CampusOSAdmissionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading admissions...</div>}>
      <AdmissionContent />
    </Suspense>
  );
}
