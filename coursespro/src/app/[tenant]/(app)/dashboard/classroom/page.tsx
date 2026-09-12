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