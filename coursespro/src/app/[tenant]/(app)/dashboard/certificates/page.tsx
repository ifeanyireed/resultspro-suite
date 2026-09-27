"use client";
import React from 'react';
import { CheckBadgeIcon, ArrowDownTrayIcon, ShareIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon as CheckBadgeSolid } from '@heroicons/react/24/solid';

export default function CertificatesPage() {
  const collected = [
    { id: 1, title: 'Front-End Web Development', date: 'Oct 15, 2026', issuedBy: 'SkillUp Academy', image: 'https://images.unsplash.com/photo-1593021966270-e44849318b76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
  ];

  const upcoming = [
    { id: 2, title: 'Full-Stack Engineering', progress: 75, criteria: 'Complete all modules and pass the final capstone project.', lockReason: 'Module 12 pending' },
    { id: 3, title: 'System Architecture Masters', progress: 10, criteria: 'Complete the architecture module and pass the quiz.', lockReason: 'Architecture module pending' }
  ];

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Certificates</h1>
          <p className="text-sm text-gray-500 mt-1">View your earned credentials and track upcoming certificates.</p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Collected Certificates */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <CheckBadgeSolid className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-900">Earned Certificates</h2>
          </div>
          
          {collected.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-[1.5rem] p-12 text-center shadow-sm">
              <CheckBadgeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3 stroke-1" />
              <h3 className="text-gray-900 font-medium mb-1">No certificates yet</h3>
              <p className="text-gray-500 text-sm">Complete your courses to earn your first certificate.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collected.map(cert => (
                <div key={cert.id} className="bg-white border border-gray-100 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  <div className="h-48 bg-gray-100 relative overflow-hidden">
                    <img src={cert.image} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white/80 text-xs font-medium mb-1 uppercase tracking-wider">{cert.issuedBy}</p>
                      <h3 className="text-white font-bold text-lg leading-tight">{cert.title}</h3>
                    </div>
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Issued On</p>
                      <p className="text-sm font-medium text-gray-900">{cert.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors" title="Download PDF">
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors" title="Share on LinkedIn">
                        <ShareIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming Certificates */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <LockClosedIcon className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900">Upcoming & Locked</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcoming.map(cert => (
              <div key={cert.id} className="bg-white border border-gray-100 rounded-[1.5rem] p-6 shadow-sm flex flex-col sm:flex-row gap-6">
                <div className="w-24 h-24 shrink-0 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center relative overflow-hidden">
                  <CheckBadgeIcon className="w-10 h-10 text-gray-300 stroke-1" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
                    <div className="h-full bg-blue-500" style={{ width: `${cert.progress}%` }}></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{cert.title}</h3>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{cert.progress}% Complete</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">{cert.criteria}</p>
                  
                  <div className="flex items-center gap-2 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                    <LockClosedIcon className="w-3.5 h-3.5" />
                    Locked: {cert.lockReason}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
