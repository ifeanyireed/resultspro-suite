const fs = require('fs');
const path = require('path');

function generateLayout(role, title, prefix) {
    return `"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';
import { 
  Squares2X2Icon, 
  MapIcon, 
  BriefcaseIcon, 
  FolderOpenIcon,
  VideoCameraIcon,
  UserGroupIcon,
  AcademicCapIcon,
  TrophyIcon,
  Cog6ToothIcon, 
  QuestionMarkCircleIcon, 
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { 
  Squares2X2Icon as Squares2X2Solid,
} from '@heroicons/react/24/solid';

export default function ${role}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/${prefix}/dashboard') {
      return pathname === '/${prefix}/dashboard';
    }
    return pathname.startsWith(path);
  };

  return (
    <ModernDashboardLayout
      sidebarContent={
        <>
          <div>
            <div className="px-8 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center font-bold text-white text-base shadow-sm">
                T
              </div>
            </div>

            <div className="px-6 space-y-1">
              <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">TUTORSPRO (${title})</p>
              
              <Link href="/${prefix}/dashboard" className={\`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors \${isActive('/${prefix}/dashboard') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}>
                {isActive('/${prefix}/dashboard') ? <Squares2X2Solid className="w-6 h-6" /> : <Squares2X2Icon className="w-6 h-6" />}
                Dashboard
              </Link>
              
              <Link href="/${prefix}/classes" className={\`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors \${isActive('/${prefix}/classes') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}>
                <VideoCameraIcon className="w-6 h-6" />
                Live Classes
              </Link>

              <Link href="/${prefix}/progress" className={\`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors \${isActive('/${prefix}/progress') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}>
                <TrophyIcon className="w-6 h-6" />
                Progress & Reports
              </Link>
              
              <Link href="/${prefix}/messages" className={\`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors \${isActive('/${prefix}/messages') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}>
                <EnvelopeIcon className="w-6 h-6" />
                Messages
              </Link>
            </div>

            <div className="px-6 mt-8 space-y-1">
              <p className="px-2 text-xs font-semibold text-gray-400 tracking-wider mb-3">SYSTEM</p>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <Link href="/${prefix}/settings" className={\`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors \${isActive('/${prefix}/settings') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}>
                  <Cog6ToothIcon className="w-6 h-6" />
                  Settings
                </Link>
                <Link href="/${prefix}/help" className={\`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors \${isActive('/${prefix}/help') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}>
                  <QuestionMarkCircleIcon className="w-6 h-6" />
                  Help
                </Link>
                <Link href="#" className="flex items-center gap-3 text-lg px-4 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-normal relative transition-colors border-transparent">
                  <ArrowRightOnRectangleIcon className="w-6 h-6" />
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </>
      }
      headerContent={
        <>
            <div className="relative w-96">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-white border border-white focus:border-gray-200 outline-none rounded-xl py-3 pl-12 pr-12 text-sm text-gray-700 shadow-sm transition-colors placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:text-gray-900 transition-colors relative">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-3 ml-2 border-l border-gray-200 pl-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-full overflow-hidden flex items-center justify-center border-2 border-white shadow-sm font-bold text-indigo-600">
                  ${role.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-gray-900 leading-tight">${role} User</p>
                  <p className="text-xs text-gray-500">${prefix}@example.com</p>
                </div>
              </div>
            </div>
        </>
      }
    >
      {children}
    </ModernDashboardLayout>
  );
}
`;
}

const dir = path.join(__dirname, 'tutorspro/src/app');
fs.writeFileSync(path.join(dir, 'tutor/layout.tsx'), generateLayout('Tutor', 'INSTRUCTOR', 'tutor'));
fs.writeFileSync(path.join(dir, 'student/layout.tsx'), generateLayout('Student', 'LEARNER', 'student'));
fs.writeFileSync(path.join(dir, 'parent/layout.tsx'), generateLayout('Parent', 'GUARDIAN', 'parent'));

// Install heroicons in tutorspro
console.log('Layouts written.');
