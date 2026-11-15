'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import FacilitiesManager, { type FacilitiesSubtab } from '../FacilitiesManager';

function FacilitiesContent() {
  const searchParams = useSearchParams();
  const subtabParam = searchParams.get('subtab') as FacilitiesSubtab | null;
  const validSubtabs: FacilitiesSubtab[] = ['overview', 'venues', 'bookings', 'equipment'];
  const initialSubtab = subtabParam && validSubtabs.includes(subtabParam) ? subtabParam : 'overview';

  return <FacilitiesManager initialSubtab={initialSubtab} />;
}

export default function CampusOSFacilitiesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Facilities & Venues...</div>}>
      <FacilitiesContent />
    </Suspense>
  );
}
