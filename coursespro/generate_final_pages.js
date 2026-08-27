const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'app', '(app)');

const templates = {
  messages: `
"use client";
import React from 'react';
import { PaperAirplaneIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';

export default function MessagesPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">Direct communication with peers and mentors.</p>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm flex h-[600px] overflow-hidden">
        <div className="w-1/3 border-r border-gray-100 bg-gray-50/50 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <input type="text" placeholder="Search messages..." className="w-full bg-white border border-gray-200 rounded-full py-2 px-4 text-sm focus:outline-none focus:border-[#146ef5]" />
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 bg-white border-l-4 border-[#146ef5] cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm text-gray-900">David K.</span>
                <span className="text-xs text-gray-400">10:42 AM</span>
              </div>
              <p className="text-xs text-gray-500 truncate">Hey! Did you finish the API gateway module?</p>
            </div>
            <div className="p-4 border-l-4 border-transparent cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm text-gray-900">Mentor Sarah</span>
                <span className="text-xs text-gray-400">Yesterday</span>
              </div>
              <p className="text-xs text-gray-500 truncate">I left some feedback on your PR. Looks solid overall.</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">David K.</h3>
                <p className="text-xs text-emerald-500 font-medium">Online</p>
              </div>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30 flex flex-col gap-4">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
              <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm shadow-sm">
                <p className="text-sm text-gray-700">Hey! Did you finish the API gateway module? I'm getting a weird CORS error on the local dev server.</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input type="text" placeholder="Write a message..." className="flex-1 bg-gray-50 border border-gray-200 rounded-full py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]" />
              <button className="w-10 h-10 rounded-full bg-[#146ef5] text-white flex items-center justify-center shrink-0 hover:bg-[#105bd1] transition-colors shadow-sm">
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
`,
  calendar: `
"use client";
import React from 'react';
import { CalendarIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

export default function CalendarPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Schedule & Events</h1>
          <p className="text-sm text-gray-500 mt-1">Upcoming live sessions, mentor syncs, and project deadlines.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex flex-col items-center justify-center shrink-0 text-[#146ef5]">
              <span className="text-xs font-bold uppercase">Oct</span>
              <span className="text-xl font-black">12</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">Weekly Cohort Sync</h3>
              <p className="text-sm text-gray-500 mb-2">Live Q&A covering state management and React hooks.</p>
              <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4"/> 4:00 PM - 5:30 PM (WAT)</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Live Class</span>
              </div>
            </div>
            <button className="bg-white border border-[#146ef5] text-[#146ef5] hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              RSVP
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
`,
  resources: `
"use client";
import React from 'react';
import { DocumentDuplicateIcon, ArrowDownTrayIcon, PlayCircleIcon } from '@heroicons/react/24/outline';

export default function ResourcesPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shared Resources</h1>
          <p className="text-sm text-gray-500 mt-1">Session recordings, slide decks, and external learning materials.</p>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">File Name</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date Added</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <PlayCircleIcon className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-gray-900">Week 1 Kickoff Session (Recording)</span>
                </div>
              </td>
              <td className="py-4 px-6 text-sm text-gray-500">Video (MP4)</td>
              <td className="py-4 px-6 text-sm text-gray-500">Oct 1, 2026</td>
              <td className="py-4 px-6 text-right">
                <button className="text-[#146ef5] hover:text-[#105bd1] font-semibold text-sm">Watch</button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <DocumentDuplicateIcon className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-900">Git & GitHub Cheatsheet</span>
                </div>
              </td>
              <td className="py-4 px-6 text-sm text-gray-500">Document (PDF)</td>
              <td className="py-4 px-6 text-sm text-gray-500">Oct 3, 2026</td>
              <td className="py-4 px-6 text-right">
                <button className="text-[#146ef5] hover:text-[#105bd1] font-semibold text-sm flex items-center gap-1 ml-auto">
                  <ArrowDownTrayIcon className="w-4 h-4"/> Download
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
`,
  settings: `
"use client";
import React from 'react';

export default function SettingsPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account, billing, and platform preferences.</p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#146ef5]" defaultValue="David K." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#146ef5]" defaultValue="david@example.com" />
            </div>
            <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all mt-2">
              Save Changes
            </button>
          </div>
        </div>
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
