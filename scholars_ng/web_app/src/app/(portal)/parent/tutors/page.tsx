'use client';

import React from 'react';
import { 
  UserGroupIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

export default function ParentTutorsPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tutors & Support</h1>
          <p className="text-sm text-gray-500 mt-1">Book 1-on-1 sessions or extra support for Alex.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Dr. Smith', subject: 'Mathematics Specialist', rating: '4.9', img: 'character5.jpg' },
          { name: 'Ms. Taylor', subject: 'English & Essay Writing', rating: '4.8', img: 'character6.jpg' },
          { name: 'David E.', subject: 'Courses Coding Mentor', rating: '5.0', img: 'character3.jpg' },
        ].map((t, i) => (
          <div key={i} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform">
            <div className="w-24 h-24 rounded-full bg-gray-100 mb-4 overflow-hidden shadow-sm border-4 border-white">
              <img src={`/avatars/${t.img}`} alt={t.name} className="w-full h-full object-cover" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{t.name}</h3>
            <p className="text-xs text-[#146ef5] font-semibold mb-2">{t.subject}</p>
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
              ⭐ {t.rating} / 5.0
            </div>
            <button className="w-full bg-white border border-[#146ef5] text-[#146ef5] hover:bg-blue-50 text-sm font-semibold py-2.5 rounded-full transition-colors flex items-center justify-center gap-2">
              <VideoCameraIcon className="w-4 h-4" /> Book Session
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
