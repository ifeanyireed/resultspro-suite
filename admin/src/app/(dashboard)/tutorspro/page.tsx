'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/Badge';
import { GraduationCap, Star, CheckCircle2, DollarSign, Search } from 'lucide-react';

export default function TutorsProAdminPage() {
  const tutors = [
    { id: '1', name: 'Dr. Alabi Adeyemi', subjects: 'Further Mathematics, Physics', rate: '₦7,500/hr', rating: 4.9, reviews: 42, lessons: 180, status: 'VERIFIED' },
    { id: '2', name: 'Engr. Chioma Nwachukwu', subjects: 'Chemistry, Coding (Python)', rate: '₦6,000/hr', rating: 5.0, reviews: 36, lessons: 125, status: 'VERIFIED' },
    { id: '3', name: 'Mr. Babatunde Lawal', subjects: 'English Literature, History', rate: '₦5,000/hr', rating: 4.8, reviews: 28, lessons: 94, status: 'VERIFIED' },
    { id: '4', name: 'Miss Sarah Johnson', subjects: 'Biology, Cambridge IGCSE', rate: '₦8,000/hr', rating: 5.0, reviews: 19, lessons: 60, status: 'PENDING' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-full">
      <Header
        title="TutorsPRO Marketplace Oversight"
        subtitle="Manage private tutor credentials, hourly rate controls, and lesson booking disputes"
      />

      <div className="p-8 space-y-8 max-w-[1400px] mx-auto w-full">
        <div className="flex justify-between items-center">
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" /></div>
            <input
              type="text"
              placeholder="Search tutors by name or subject..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
            />
          </div>
        </div>

        {/* Tutors Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Tutor Name</th>
                <th className="px-4 py-3">Subjects Offered</th>
                <th className="px-4 py-3">Hourly Rate</th>
                <th className="px-4 py-3">Rating & Reviews</th>
                <th className="px-4 py-3">Total Lessons Completed</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tutors.map((t) => (
                <tr key={t.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-4 py-3.5 font-medium text-slate-800 text-xs flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                      {t.name.charAt(0)}
                    </div>
                    <span>{t.name}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 font-semibold">{t.subjects}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-800 text-xs">{t.rate}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center space-x-1 font-semibold text-slate-900">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{t.rating}</span>
                      <span className="text-slate-400 font-normal">({t.reviews})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800 text-xs">{t.lessons}</td>
                  <td className="px-4 py-3.5">
                    <Badge status={t.status} />
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    {t.status === 'PENDING' ? (
                      <button className="px-2.5 py-1 bg-emerald-600 text-white rounded-full font-semibold text-[11px] hover:bg-emerald-700 whitespace-nowrap">
                        Verify Tutor
                      </button>
                    ) : (
                      <button className="text-blue-600 hover:underline font-semibold">View Profile</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
