'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ClinicManager, { type ClinicSubtab } from '../ClinicManager';

function ClinicContent() {
  const searchParams = useSearchParams();
  const subtabParam = searchParams.get('subtab') as ClinicSubtab | null;
  const validSubtabs: ClinicSubtab[] = ['overview', 'visits', 'passports', 'medications'];
  const initialSubtab = subtabParam && validSubtabs.includes(subtabParam) ? subtabParam : 'overview';

  return <ClinicManager initialSubtab={initialSubtab} />;
}

export default function CampusOSClinicPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Clinic & Sick Bay...</div>}>
      <ClinicContent />
    </Suspense>
  );
}
