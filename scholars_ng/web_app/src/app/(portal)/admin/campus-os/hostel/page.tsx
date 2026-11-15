'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import HostelManager, { type HostelSubtab } from '../HostelManager';

function HostelContent() {
  const searchParams = useSearchParams();
  const subtabParam = searchParams.get('subtab') as HostelSubtab | null;
  const validSubtabs: HostelSubtab[] = ['overview', 'allocations', 'exeats', 'rollcalls'];
  const initialSubtab = subtabParam && validSubtabs.includes(subtabParam) ? subtabParam : 'overview';

  return <HostelManager initialSubtab={initialSubtab} />;
}

export default function CampusOSHostelPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Hostel & Boarding...</div>}>
      <HostelContent />
    </Suspense>
  );
}
