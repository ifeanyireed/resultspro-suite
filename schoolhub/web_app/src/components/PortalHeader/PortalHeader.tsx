'use client';

import Image from 'next/image';
import { 
  MagnifyingGlassIcon,
  EnvelopeIcon,
  BellIcon
} from '@heroicons/react/24/outline';

export default function PortalHeader() {
  return (
    <>
      <div className="relative w-96">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search resources, lessons, or files..." 
          className="w-full bg-white border border-white focus:border-gray-200 outline-none rounded-xl py-3 pl-12 pr-12 text-sm text-gray-700 shadow-sm transition-colors placeholder:text-gray-400"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-gray-100 rounded px-1.5 py-0.5 border border-gray-200">
          <span className="text-[10px] font-medium text-gray-500">⌘</span>
          <span className="text-[10px] font-medium text-gray-500">K</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:text-gray-900 transition-colors">
          <EnvelopeIcon className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:text-gray-900 transition-colors relative">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 ml-2 border-l border-gray-200 pl-6">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-200 to-blue-100 rounded-full overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
            <Image src="/photo01.jpeg" alt="James Dean" width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">James Dean</p>
            <p className="text-xs text-gray-500">Parent Account</p>
          </div>
        </div>
      </div>
    </>
  );
}
