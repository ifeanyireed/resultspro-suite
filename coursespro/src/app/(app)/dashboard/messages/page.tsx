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