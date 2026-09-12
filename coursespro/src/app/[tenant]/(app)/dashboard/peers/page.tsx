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
            <div className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${peer.status === 'Online' ? 'bg-emerald-500' : peer.status === 'In Session' ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 mb-4 overflow-hidden">
               <img src={`https://i.pravatar.cc/150?u=${peer.name}`} alt={peer.name} />
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