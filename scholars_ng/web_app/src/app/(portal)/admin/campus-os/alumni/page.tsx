'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AlumniManager, { type AlumniSubtab } from '../AlumniManager';

function AlumniContent() {
  const searchParams = useSearchParams();
  const subtabParam = searchParams.get('subtab') as AlumniSubtab | null;
  const validSubtabs: AlumniSubtab[] = ['overview', 'directory', 'transcripts', 'verifications'];
  const initialSubtab = subtabParam && validSubtabs.includes(subtabParam) ? subtabParam : 'overview';

  return <AlumniManager initialSubtab={initialSubtab} />;
}

export default function CampusOSAlumniPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Alumni & Credential Registry...</div>}>
      <AlumniContent />
    </Suspense>
  );
}
