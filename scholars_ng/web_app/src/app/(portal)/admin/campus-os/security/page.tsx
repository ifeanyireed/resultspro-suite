'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SecurityManager, { type SecuritySubtab } from '../SecurityManager';

function SecurityContent() {
  const searchParams = useSearchParams();
  const subtabParam = searchParams.get('subtab') as SecuritySubtab | null;
  const validSubtabs: SecuritySubtab[] = ['overview', 'visitors', 'pickups', 'incidents'];
  const initialSubtab = subtabParam && validSubtabs.includes(subtabParam) ? subtabParam : 'overview';

  return <SecurityManager initialSubtab={initialSubtab} />;
}

export default function CampusOSSecurityPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Security & Gate Safeguarding...</div>}>
      <SecurityContent />
    </Suspense>
  );
}
