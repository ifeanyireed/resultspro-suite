const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'app', '(app)');

const templates = {
  journey: `
"use client";
import React from 'react';
import { PlayIcon, CheckCircleIcon, LockClosedIcon, DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function JourneyPage() {
  const stages = [
    { title: 'Foundational Knowledge', status: 'completed', desc: 'Core concepts and theory.', duration: '2 Weeks' },
    { title: 'Practical Application', status: 'completed', desc: 'Hands-on exercises and mini-projects.', duration: '3 Weeks' },
    { title: 'Projects', status: 'current', desc: 'Build your first full-stack application.', duration: '4 Weeks' },
    { title: 'Feedback & Iteration', status: 'locked', desc: 'Mentor reviews and refinement.', duration: '2 Weeks' },
    { title: 'Demo Day', status: 'locked', desc: 'Present to the cohort and industry partners.', duration: '1 Week' },
    { title: 'Portfolio', status: 'locked', desc: 'Publish your case studies.', duration: '1 Week' },
  ];

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">The Learning Journey</h1>
          <p className="text-sm text-gray-500 mt-1">Master the curriculum step-by-step through guided mentorship.</p>
        </div>
        <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2">
          <PlayIcon className="w-4 h-4" />
          Resume Module
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {stages.map((stage, i) => (
            <div key={i} className={\`bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex items-center gap-6 \${stage.status === 'locked' ? 'opacity-60' : ''}\`}>
              <div className={\`w-12 h-12 rounded-full flex items-center justify-center shrink-0 \${
                stage.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                stage.status === 'current' ? 'bg-blue-50 text-[#146ef5]' : 'bg-gray-50 text-gray-400'
              }\`}>
                {stage.status === 'completed' && <CheckCircleIcon className="w-6 h-6" />}
                {stage.status === 'current' && <DocumentTextIcon className="w-6 h-6" />}
                {stage.status === 'locked' && <LockClosedIcon className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-medium text-gray-900">{stage.title}</h3>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{stage.duration}</span>
                </div>
                <p className="text-sm text-gray-500">{stage.desc}</p>
              </div>
              {stage.status === 'current' && (
                <button className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-900 transition-colors">
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 relative overflow-hidden group">
             <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full filter blur-[2rem] opacity-30"></div>
             <h3 className="text-xl font-normal text-white mb-6">Journey Progress</h3>
             <h2 className="text-5xl font-medium tracking-tight text-white mb-2">38%</h2>
             <p className="text-sm text-white/80">You are on track to graduate by Oct 15th.</p>
          </div>
        </div>
      </div>
    </>
  );
}
`,
  workspace: `
"use client";
import React from 'react';
import { PlusIcon, ChatBubbleLeftIcon, PaperClipIcon } from '@heroicons/react/24/outline';

export default function WorkspacePage() {
  const columns = [
    { name: 'To Do', count: 3, color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
    { name: 'In Progress', count: 2, color: 'bg-blue-50 text-[#146ef5]', dot: 'bg-[#146ef5]' },
    { name: 'In Review', count: 1, color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' },
    { name: 'Done', count: 5, color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
  ];

  const tasks = [
    { title: 'Draft API Schema', col: 'In Progress', tags: ['Backend'], comments: 4, attachments: 2 },
    { title: 'Setup UI Library', col: 'To Do', tags: ['Frontend'], comments: 0, attachments: 1 },
    { title: 'Peer Review Auth', col: 'In Review', tags: ['Security'], comments: 12, attachments: 0 },
  ];

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Workspace</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your sprint tasks and project deliverables.</p>
        </div>
        <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map(col => (
          <div key={col.name} className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className={\`w-2.5 h-2.5 rounded-full \${col.dot}\`}></div>
                <h3 className="font-medium text-gray-900">{col.name}</h3>
              </div>
              <span className={\`text-xs font-bold px-2 py-0.5 rounded \${col.color}\`}>{col.count}</span>
            </div>
            
            {tasks.filter(t => t.col === col.name).map((task, i) => (
              <div key={i} className="bg-white rounded-[1.25rem] p-5 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform cursor-pointer group">
                <h4 className="text-sm font-medium text-gray-900 mb-3">{task.title}</h4>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {task.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-gray-400">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1"><ChatBubbleLeftIcon className="w-3.5 h-3.5"/> <span className="text-xs">{task.comments}</span></div>
                    <div className="flex items-center gap-1"><PaperClipIcon className="w-3.5 h-3.5"/> <span className="text-xs">{task.attachments}</span></div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
`,
  classroom: `
"use client";
import React from 'react';
import { VideoCameraIcon, ChatBubbleBottomCenterTextIcon, HandRaisedIcon } from '@heroicons/react/24/outline';

export default function ClassroomPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Live Classroom</h1>
          <p className="text-sm text-gray-500 mt-1">Join scheduled cohort sessions and interact with mentors.</p>
        </div>
        <button className="bg-white border border-[#146ef5] text-[#146ef5] hover:bg-[#f6f9f8] text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
          <VideoCameraIcon className="w-4 h-4" />
          Join Next Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <div className="lg:col-span-2 bg-gray-900 rounded-[1.5rem] flex items-center justify-center relative overflow-hidden group shadow-sm">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
          <div className="text-center z-10">
            <h2 className="text-3xl font-medium text-white mb-2">Session Offline</h2>
            <p className="text-white/70">Next class: "State Management in React" at 4:00 PM</p>
          </div>
        </div>
        
        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center gap-2"><ChatBubbleBottomCenterTextIcon className="w-5 h-5"/> Live Chat</h3>
            <span className="text-xs font-medium bg-white px-2 py-1 rounded border border-gray-200">12 Online</span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-blue-100 shrink-0"></div>
               <div><p className="text-xs font-bold text-gray-900">Sarah M.</p><p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg mt-1 rounded-tl-none">Will this session be recorded?</p></div>
             </div>
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-orange-100 shrink-0"></div>
               <div><p className="text-xs font-bold text-gray-900">Mentor Dave <span className="bg-[#146ef5] text-white px-1.5 py-0.5 rounded-[4px] text-[9px] ml-1">MENTOR</span></p><p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg mt-1 rounded-tl-none">Yes, all sessions are uploaded to the resources tab within 2 hours.</p></div>
             </div>
          </div>
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="relative">
              <input type="text" placeholder="Type a message..." className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]" disabled />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
`,
  peers: `
"use client";
import React from 'react';
import { ChatBubbleLeftRightIcon, AcademicCapIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function PeersPage() {
  const peers = [
    { name: 'Sarah M.', role: 'Frontend Developer', loc: 'Lagos, NG', status: 'Online' },
    { name: 'David K.', role: 'Product Designer', loc: 'Abuja, NG', status: 'Offline' },
    { name: 'Amaka O.', role: 'Backend Engineer', loc: 'Remote', status: 'Online' },
    { name: 'Tunde B.', role: 'Fullstack Developer', loc: 'London, UK', status: 'In Session' },
  ];

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Cohort Peers</h1>
          <p className="text-sm text-gray-500 mt-1">Network, collaborate, and learn alongside your fellow builders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {peers.map((peer, i) => (
          <div key={i} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm text-center group hover:-translate-y-1 transition-transform relative">
            <div className={\`absolute top-4 right-4 w-2.5 h-2.5 rounded-full \${peer.status === 'Online' ? 'bg-emerald-500' : peer.status === 'In Session' ? 'bg-amber-500' : 'bg-gray-300'}\`}></div>
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 mb-4 overflow-hidden">
               <img src={\`https://i.pravatar.cc/150?u=\${peer.name}\`} alt={peer.name} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{peer.name}</h3>
            <p className="text-sm text-[#146ef5] font-medium mb-1">{peer.role}</p>
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mb-6"><MapPinIcon className="w-3 h-3"/> {peer.loc}</p>
            
            <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold py-2 rounded-xl transition-colors flex justify-center items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-4 h-4"/> Message
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
`,
  mentor: `
"use client";
import React from 'react';
import { CalendarDaysIcon, StarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

export default function MentorsPage() {
  const mentors = [
    { name: 'Michael O.', exp: 'Senior SWE @ Paystack', rating: 4.9, reviews: 124 },
    { name: 'Jessica A.', exp: 'Lead Designer @ Moniepoint', rating: 5.0, reviews: 89 },
    { name: 'Samuel I.', exp: 'Staff Engineer @ Google', rating: 4.8, reviews: 210 },
  ];

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mentor Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Book 1-on-1 sessions with industry experts for code reviews and guidance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor, i) => (
          <div key={i} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
                 <img src={\`https://i.pravatar.cc/150?u=\${mentor.name}mentor\`} alt={mentor.name} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{mentor.name}</h3>
                <p className="text-sm text-gray-500">{mentor.exp}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <StarSolid className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-gray-900">{mentor.rating}</span>
                  <span>({mentor.reviews} reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2">
                <CalendarDaysIcon className="w-4 h-4"/> Book Session
              </button>
              <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2">
                <ChatBubbleLeftIcon className="w-4 h-4"/> Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
`,
  leaderboard: `
"use client";
import React from 'react';
import { TrophyIcon, FireIcon } from '@heroicons/react/24/outline';

export default function LeaderboardPage() {
  const leaders = [
    { rank: 1, name: 'David K.', xp: 4520, streak: 14, avatar: 'david' },
    { rank: 2, name: 'Sarah M.', xp: 4100, streak: 12, avatar: 'sarah' },
    { rank: 3, name: 'Tunde B.', xp: 3950, streak: 8, avatar: 'tunde' },
    { rank: 4, name: 'Amaka O.', xp: 3800, streak: 5, avatar: 'amaka' },
    { rank: 5, name: 'John D.', xp: 3420, streak: 2, avatar: 'john' },
  ];

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Cohort Leaderboard</h1>
          <p className="text-sm text-gray-500 mt-1">Earn XP by completing modules, helping peers, and shipping projects.</p>
        </div>
        <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm border border-orange-100">
           <FireIcon className="w-5 h-5" />
           <span className="font-bold text-sm">12 Day Streak!</span>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-16 text-center">Rank</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Builder</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">XP Earned</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Active Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leaders.map((leader) => (
              <tr key={leader.rank} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-center">
                  {leader.rank === 1 ? <TrophyIcon className="w-6 h-6 mx-auto text-amber-500" /> : 
                   leader.rank === 2 ? <TrophyIcon className="w-6 h-6 mx-auto text-gray-400" /> :
                   leader.rank === 3 ? <TrophyIcon className="w-6 h-6 mx-auto text-orange-400" /> :
                   <span className="text-gray-500 font-bold">{leader.rank}</span>}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0"><img src={\`https://i.pravatar.cc/150?u=\${leader.avatar}\`} alt={leader.name} /></div>
                    <span className="font-medium text-gray-900">{leader.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#146ef5]">{leader.xp.toLocaleString()} XP</span>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-[#146ef5]" style={{ width: \`\${(leader.xp/5000)*100}%\`}}></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-lg"><FireIcon className="w-4 h-4"/> {leader.streak} Days</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
