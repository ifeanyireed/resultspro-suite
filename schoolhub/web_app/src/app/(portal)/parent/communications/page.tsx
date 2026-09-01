'use client';

import React from 'react';
import { 
  EnvelopeIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

export default function ParentCommunicationsPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Communications</h1>
          <p className="text-sm text-gray-500 mt-1">Direct messages with teachers and school admin.</p>
        </div>
        <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
          <PencilSquareIcon className="w-4 h-4" />
          New Message
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 flex h-[600px] overflow-hidden">
        {/* Inbox List */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-medium text-gray-900">Inbox</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {[
              { name: 'Mr. Davies', subject: 'Math Project Update', time: '10:42 AM', unread: true },
              { name: 'School Admin', subject: 'Term 2 Fee Schedule', time: 'Yesterday', unread: false },
              { name: 'Coach Smith', subject: 'Soccer Tryouts', time: 'Oct 12', unread: false },
            ].map((m, i) => (
              <div key={i} className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${m.unread ? 'bg-blue-50/50' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm ${m.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{m.name}</h4>
                  <span className="text-[10px] text-gray-400">{m.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{m.subject}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 flex flex-col bg-gray-50/30">
          <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-white">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img src="/avatars/character2.jpg" alt="Teacher" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Mr. Davies</h3>
              <p className="text-xs text-gray-500">Advanced Mathematics</p>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
            <div className="self-start max-w-[80%] bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm">
              <p className="text-sm text-gray-700">Hello Mrs. Smith, I just wanted to let you know Alex is doing great in Algebra this week.</p>
              <span className="text-[10px] text-gray-400 mt-2 block">10:42 AM</span>
            </div>
          </div>
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative">
              <input type="text" placeholder="Reply to Mr. Davies..." className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 pl-4 pr-12 text-sm outline-none focus:border-[#146ef5] transition-colors" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#146ef5] text-white rounded-full flex items-center justify-center">
                <EnvelopeIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
