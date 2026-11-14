'use client';

import React from 'react';
import { 
  UserGroupIcon,
  VideoCameraIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { SpecialistAppContainer, AppSubtab } from '@/components/SpecialistAppContainer';
import { FindTutorView, StudentBookingsView } from '@tutorspro/modules';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

function ParentTutorsList() {
  return (
    <div style={{ maxWidth: '1200px', padding: '1rem 0 4rem 0' }}>
      <MotionRise>
        <header style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
            Personalized Tutoring Directory
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
            Book 1-on-1 sessions or ongoing subject mastery support for your ward.
          </p>
        </header>
      </MotionRise>

      <MotionStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Dr. Smith', subject: 'Mathematics Specialist', rating: '4.9', img: 'character5.jpg' },
          { name: 'Ms. Taylor', subject: 'English & Essay Writing', rating: '4.8', img: 'character6.jpg' },
          { name: 'David E.', subject: 'Coding & Robotics Mentor', rating: '5.0', img: 'character3.jpg' },
        ].map((t, i) => (
          <MotionRise key={i} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform">
            <div className="w-24 h-24 rounded-full bg-gray-100 mb-4 overflow-hidden shadow-sm border-4 border-white">
              <img src={`/avatars/${t.img}`} alt={t.name} className="w-full h-full object-cover" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{t.name}</h3>
            <p className="text-xs text-[#10b981] font-semibold mb-2">{t.subject}</p>
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
              ⭐ {t.rating} / 5.0
            </div>
            <button className="w-full bg-white border border-[#10b981] text-[#10b981] hover:bg-emerald-50 text-sm font-semibold py-2.5 rounded-full transition-colors flex items-center justify-center gap-2">
              <VideoCameraIcon className="w-4 h-4" /> Book Session
            </button>
          </MotionRise>
        ))}
      </MotionStagger>
    </div>
  );
}

export default function ParentTutorsHub() {
  const tabs: AppSubtab[] = [
    {
      id: 'active',
      label: 'Recommended Mentors',
      icon: UserGroupIcon,
      component: ParentTutorsList,
    },
    {
      id: 'discover',
      label: 'Discover Tutors',
      icon: MagnifyingGlassIcon,
      component: FindTutorView,
    },
    {
      id: 'bookings',
      label: 'Session Bookings',
      icon: CalendarDaysIcon,
      component: StudentBookingsView,
    },
  ];

  return (
    <MotionRise>
      <SpecialistAppContainer
        appTitle="Parent Tutoring Concierge"
        appSubtitle="Vetted 1-on-1 instructors, scheduled lesson bookings, and progress tracking."
        appBadge="TutorsPRO"
        accentColor="#10b981"
        tabs={tabs}
        defaultTabId="active"
      />
    </MotionRise>
  );
}
