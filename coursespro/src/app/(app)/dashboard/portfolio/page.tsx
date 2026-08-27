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