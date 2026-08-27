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
                 <img src={`https://i.pravatar.cc/150?u=${mentor.name}mentor`} alt={mentor.name} />
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