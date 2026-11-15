'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CoCurricularManager, { type CoCurricularSubtab } from '../CoCurricularManager';

function CoCurricularContent() {
  const searchParams = useSearchParams();
  const subtabParam = searchParams.get('subtab') as CoCurricularSubtab | null;
  const validSubtabs: CoCurricularSubtab[] = ['overview', 'houses', 'clubs', 'fixtures'];
  const initialSubtab = subtabParam && validSubtabs.includes(subtabParam) ? subtabParam : 'overview';

  return <CoCurricularManager initialSubtab={initialSubtab} />;
}

export default function CampusOSCoCurricularPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Co-Curricular & House System...</div>}>
      <CoCurricularContent />
    </Suspense>
  );
}
