const fs = require('fs');
const path = require('path');

const mentorDir = path.join(__dirname, 'src', 'app', '(mentor)', 'mentor');

const templates = {
  '': `
"use client";
import React from 'react';
import { CheckCircleIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

export default function MentorDashboard() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mentor Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your cohorts and review builder submissions.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-between aspect-square relative overflow-hidden group">
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-normal text-white">Pending Reviews</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"><DocumentDuplicateIcon className="w-4 h-4"/></div>
          </div>
          <div className="z-10">
            <h2 className="text-5xl font-medium tracking-tight text-white mb-2">12</h2>
          </div>
        </div>
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Total Earnings</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"><ArrowTrendingUpIcon className="w-4 h-4" /></div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">₦450k</h2>
          </div>
        </div>
      </div>
    </>
  );
}
`,
  reviews: `
"use client";
import React from 'react';

export default function MentorReviews() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pending Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Evaluate and grade builder project submissions.</p>
        </div>
      </div>
      <div className="bg-white rounded-[1.5rem] p-8 border border-gray-100 shadow-sm text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending reviews</h3>
        <p className="text-gray-500 text-sm">Your queue is completely clear!</p>
      </div>
    </>
  );
}
`,
  cohorts: `
"use client";
import React from 'react';

export default function MentorCohorts() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Cohorts</h1>
          <p className="text-sm text-gray-500 mt-1">Cohorts you are currently assigned to mentor.</p>
        </div>
      </div>
    </>
  );
}
`,
  sessions: `
"use client";
import React from 'react';

export default function MentorSessions() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">1:1 Sessions</h1>
          <p className="text-sm text-gray-500 mt-1">Your upcoming booked mentorship calls.</p>
        </div>
      </div>
    </>
  );
}
`,
  earnings: `
"use client";
import React from 'react';

export default function MentorEarnings() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Earnings</h1>
          <p className="text-sm text-gray-500 mt-1">Track your mentor bounties and payouts.</p>
        </div>
      </div>
    </>
  );
}
`,
  settings: `
"use client";
import React from 'react';

export default function MentorSettings() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your mentor profile and availability.</p>
        </div>
      </div>
    </>
  );
}
`
};

for (const [folder, content] of Object.entries(templates)) {
  const dirPath = folder ? path.join(mentorDir, folder) : mentorDir;
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content.trim());
  console.log('Generated ' + folder + '/page.tsx');
}
