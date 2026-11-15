'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DisciplineManager, { type DisciplineSubtab } from '../DisciplineManager';

function DisciplineContent() {
  const searchParams = useSearchParams();
  const subtabParam = searchParams.get('subtab') as DisciplineSubtab | null;
  const validSubtabs: DisciplineSubtab[] = ['overview', 'demerits', 'merits', 'counseling'];
  const initialSubtab = subtabParam && validSubtabs.includes(subtabParam) ? subtabParam : 'overview';

  return <DisciplineManager initialSubtab={initialSubtab} />;
}

export default function CampusOSDisciplinePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Discipline & Pastoral Care...</div>}>
      <DisciplineContent />
    </Suspense>
  );
}
