'use client';

import React from 'react';
import { 
  LockClosedIcon,
  CheckCircleIcon,
  PlayIcon,
  TrophyIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

export default function ParentFutureSkillsPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Future Skills Journey</h1>
          <p className="text-sm text-gray-500 mt-1">Track Alex's progress in coding, AI, and Courses projects.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2">
            <TrophyIcon className="w-4 h-4" />
            View Certificate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-6">
        
        {/* Main Journey Flow */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-normal text-gray-900">Level 2: Web Development</h3>
              <span className="px-3 py-1 bg-[#146ef5]/10 text-[#146ef5] font-bold text-xs rounded-full">Current Pathway</span>
            </div>
            
            <div className="relative pl-8 border-l-2 border-gray-100 space-y-10 ml-4">
              
              {/* Completed Module */}
              <div className="relative">
                <div className="absolute -left-[43px] w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white shadow-sm text-white">
                  <CheckCircleIcon className="w-4 h-4" />
                </div>
                <h4 className="text-lg font-medium text-gray-900">Module 1: HTML Basics</h4>
                <p className="text-sm text-gray-500 mt-1">Completed on Sep 12. Score: 95%</p>
              </div>

              {/* In Progress Module */}
              <div className="relative">
                <div className="absolute -left-[43px] w-6 h-6 rounded-full bg-[#146ef5] flex items-center justify-center border-4 border-white shadow-sm ring-4 ring-[#146ef5]/20">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium text-[#146ef5]">Module 2: CSS Styling</h4>
                    <span className="text-xs font-bold text-gray-400">40% Done</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Alex is currently learning how to style web pages and make them look beautiful.</p>
                  <button className="bg-white border border-[#146ef5] text-[#146ef5] hover:bg-blue-50 text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-2">
                    <PlayIcon className="w-4 h-4" /> Resume Learning
                  </button>
                </div>
              </div>

              {/* Locked Module */}
              <div className="relative opacity-50">
                <div className="absolute -left-[43px] w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-sm text-gray-500">
                  <LockClosedIcon className="w-3 h-3" />
                </div>
                <h4 className="text-lg font-medium text-gray-900">Module 3: Javascript Intro</h4>
                <p className="text-sm text-gray-500 mt-1">Unlocks after Module 2</p>
              </div>

            </div>
          </div>
        </div>

        {/* Portfolio & Badges Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          
          <div className="w-full bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col text-white relative overflow-hidden group">
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#041533] rounded-full filter blur-[3rem] opacity-60"></div>
            <div className="relative z-10 flex justify-between items-start mb-6">
              <h3 className="text-xl font-normal">Alex's Portfolio</h3>
              <CodeBracketIcon className="w-6 h-6 text-white/50" />
            </div>
            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <h4 className="text-lg font-medium mb-1">Personal Webpage</h4>
              <p className="text-xs text-white/80 mb-4">First deployed project using HTML & CSS.</p>
              <button className="w-full bg-white text-[#146ef5] text-sm font-semibold py-2.5 rounded-full hover:bg-gray-50 transition-colors shadow-sm">
                Share Portfolio Link
              </button>
            </div>
          </div>

          <div className="w-full bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-normal text-gray-900">Badge Case</h3>
              <SparklesIcon className="w-5 h-5 text-orange-400" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { name: 'Fast Learner', color: 'bg-emerald-100 text-emerald-600' },
                { name: 'Bug Squasher', color: 'bg-orange-100 text-orange-600' },
                { name: 'Top 10%', color: 'bg-purple-100 text-purple-600' }
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-14 h-14 rounded-full ${b.color} flex items-center justify-center shadow-sm border-2 border-white`}>
                    <TrophyIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide leading-tight">{b.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
