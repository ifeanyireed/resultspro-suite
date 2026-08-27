const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'app', '(app)');

const templates = {
  projects: `
"use client";
import React from 'react';
import { FolderOpenIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function ProjectsPage() {
  const projects = [
    { title: 'API Gateway Service', status: 'In Progress', due: 'Oct 12', desc: 'Build a Go-based API gateway with rate limiting.' },
    { title: 'Authentication UI', status: 'Submitted', due: 'Sep 30', desc: 'React context based auth flow.' },
    { title: 'Final Capstone', status: 'Locked', due: 'Nov 1', desc: 'End-to-end fullstack deployment.' }
  ];

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Projects & Assignments</h1>
          <p className="text-sm text-gray-500 mt-1">Submit your code and get mentor reviews.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj, i) => (
          <div key={i} className={\`bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col \${proj.status === 'Locked' ? 'opacity-60' : ''}\`}>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center mb-4">
              <FolderOpenIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{proj.title}</h3>
            <p className="text-sm text-gray-500 mb-6 flex-1">{proj.desc}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span className={\`text-xs font-bold px-2 py-1 rounded \${proj.status === 'Submitted' ? 'bg-emerald-50 text-emerald-600' : proj.status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'}\`}>{proj.status}</span>
              <span className="text-xs font-medium text-gray-400">Due {proj.due}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
`,
  portfolio: `
"use client";
import React from 'react';
import { GlobeAltIcon, LinkIcon } from '@heroicons/react/24/outline';

export default function PortfolioPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Portfolio</h1>
          <p className="text-sm text-gray-500 mt-1">Showcase your best mentor-approved work.</p>
        </div>
        <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm flex items-center gap-2">
          <GlobeAltIcon className="w-4 h-4" />
          Publish to Web
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] p-8 border border-gray-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <LinkIcon className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects published yet</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">Complete your first major project and get it approved by a mentor to add it to your public portfolio.</p>
      </div>
    </>
  );
}
`,
  achievements: `
"use client";
import React from 'react';

export default function AchievementsPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Achievements</h1>
          <p className="text-sm text-gray-500 mt-1">Badges and certificates you've earned.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center opacity-50 grayscale">
            <div className="w-16 h-16 rounded-full bg-gray-100 mb-4"></div>
            <h3 className="text-sm font-bold text-gray-900">Locked Badge</h3>
          </div>
        ))}
      </div>
    </>
  );
}
`
};

for (const [folder, content] of Object.entries(templates)) {
  const dirPath = path.join(pagesDir, folder);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content.trim());
  console.log(`Generated ${folder}/page.tsx`);
}
