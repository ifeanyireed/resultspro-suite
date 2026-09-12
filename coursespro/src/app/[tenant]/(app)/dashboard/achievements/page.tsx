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