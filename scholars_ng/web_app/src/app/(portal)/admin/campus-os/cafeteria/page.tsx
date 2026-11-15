'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CafeteriaManager, { type CafeteriaSubtab } from '../CafeteriaManager';

function CafeteriaContent() {
  const searchParams = useSearchParams();
  const subtabParam = searchParams.get('subtab') as CafeteriaSubtab | null;
  const validSubtabs: CafeteriaSubtab[] = ['overview', 'wallets', 'pos_sales', 'menus'];
  const initialSubtab = subtabParam && validSubtabs.includes(subtabParam) ? subtabParam : 'overview';

  return <CafeteriaManager initialSubtab={initialSubtab} />;
}

export default function CampusOSCafeteriaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Cafeteria & Cashless Tuck Shop...</div>}>
      <CafeteriaContent />
    </Suspense>
  );
}
