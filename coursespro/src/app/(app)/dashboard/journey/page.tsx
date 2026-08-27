"use client";
import React from 'react';
import { PlayIcon, CheckCircleIcon, LockClosedIcon, DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function JourneyPage() {
  const stages = [
    { title: 'Foundational Knowledge', status: 'completed', desc: 'Core concepts and theory.', duration: '2 Weeks' },
    { title: 'Practical Application', status: 'completed', desc: 'Hands-on exercises and mini-projects.', duration: '3 Weeks' },
    { title: 'Projects', status: 'current', desc: 'Build your first full-stack application.', duration: '4 Weeks' },
    { title: 'Feedback & Iteration', status: 'locked', desc: 'Mentor reviews and refinement.', duration: '2 Weeks' },
    { title: 'Demo Day', status: 'locked', desc: 'Present to the cohort and industry partners.', duration: '1 Week' },
    { title: 'Portfolio', status: 'locked', desc: 'Publish your case studies.', duration: '1 Week' },
  ];

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">The Learning Journey</h1>
          <p className="text-sm text-gray-500 mt-1">Master the curriculum step-by-step through guided mentorship.</p>
        </div>
        <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2">
          <PlayIcon className="w-4 h-4" />
          Resume Module
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {stages.map((stage, i) => (
            <div key={i} className={`bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex items-center gap-6 ${stage.status === 'locked' ? 'opacity-60' : ''}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                stage.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                stage.status === 'current' ? 'bg-blue-50 text-[#146ef5]' : 'bg-gray-50 text-gray-400'
              }`}>
                {stage.status === 'completed' && <CheckCircleIcon className="w-6 h-6" />}
                {stage.status === 'current' && <DocumentTextIcon className="w-6 h-6" />}
                {stage.status === 'locked' && <LockClosedIcon className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-medium text-gray-900">{stage.title}</h3>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{stage.duration}</span>
                </div>
                <p className="text-sm text-gray-500">{stage.desc}</p>
              </div>
              {stage.status === 'current' && (
                <button className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-900 transition-colors">
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm shadow-[#146ef5]/10 relative overflow-hidden group">
             <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full filter blur-[2rem] opacity-30"></div>
             <h3 className="text-xl font-normal text-white mb-6">Journey Progress</h3>
             <h2 className="text-5xl font-medium tracking-tight text-white mb-2">38%</h2>
             <p className="text-sm text-white/80">You are on track to graduate by Oct 15th.</p>
          </div>
        </div>
      </div>
    </>
  );
}