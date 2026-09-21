const fs = require('fs');
const file = 'coursespro/src/app/(mentor)/mentor/earnings/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = `
"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { BanknotesIcon } from '@heroicons/react/24/outline';

export default function MentorEarnings() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['mentor-profile-earnings'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/profile');
      return res.data;
    }
  });

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const payoutsEnabled = profile?.payouts_enabled ?? true;

  if (!payoutsEnabled) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <BanknotesIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Earnings Managed Externally</h2>
        <p className="text-gray-500 text-sm max-w-md text-center">
          Your organization has chosen to handle mentor payouts and earnings off-platform. 
          Please contact your administrator for details on your compensation.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Earnings</h1>
          <p className="text-sm text-gray-500 mt-1">Track your mentor bounties and payouts.</p>
        </div>
      </div>
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
         <p className="text-gray-500 text-center py-10">Integration with organization's payout model pending...</p>
      </div>
    </>
  );
}
`;
fs.writeFileSync(file, code);
