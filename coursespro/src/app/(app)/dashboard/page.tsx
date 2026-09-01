'use client';

import React from 'react';
import { 
  PlayIcon,
  CheckCircleIcon,
  FireIcon,
  TrophyIcon,
  UsersIcon,
  VideoCameraIcon,
  SparklesIcon,
  BookOpenIcon,
  ClockIcon,
  CodeBracketSquareIcon
} from '@heroicons/react/24/outline';
import { FireIcon as FireSolid, StarIcon } from '@heroicons/react/24/solid';

export default function LearnerDashboard() {
  return (
    <>
      {/* Dashboard Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 mt-2 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, Ada.</h1>
          <p className="text-sm text-gray-500 mt-1">Cohort 12 • Week 4: Advanced State Management</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center gap-2">
            <VideoCameraIcon className="w-4 h-4 text-emerald-500" />
            Join Coworking Room
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-blue-600/20 transition-all flex items-center gap-2">
            <PlayIcon className="w-4 h-4" />
            Resume Module
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        
        {/* Card 1: Streak */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full filter blur-[3rem] opacity-60"></div>
          
          <div className="flex justify-between items-start z-10">
            <h3 className="text-xl font-medium text-white/90">Consistency</h3>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <FireSolid className="w-5 h-5 text-yellow-300" />
            </div>
          </div>
          
          <div className="z-10">
            <div className="flex items-baseline gap-2">
              <h2 className="text-5xl font-bold tracking-tight text-white font-sans">12</h2>
              <span className="text-white/80 font-medium">Days</span>
            </div>
            <p className="text-sm text-white/70 mt-2 font-medium">Top 5% in your cohort</p>
          </div>
        </div>

        {/* Card 2: Progress */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square hover:-translate-y-1 transition-transform group">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-500">Journey</h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <BookOpenIcon className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 font-sans">34%</h2>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-4 mb-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '34%' }}></div>
            </div>
            <p className="text-xs text-gray-500 font-medium">Module 4 of 12</p>
          </div>
        </div>

        {/* Card 3: Points/XP */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square hover:-translate-y-1 transition-transform group">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-500">Builder XP</h3>
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <TrophyIcon className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 font-sans">2,450</h2>
            <div className="flex items-center gap-1.5 mt-3">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <p className="text-sm font-bold text-gray-700">Level: Architect</p>
            </div>
          </div>
        </div>

        {/* Card 4: Upcoming */}
        <div className="bg-[#0B1021] rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-between aspect-square relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full filter blur-[2rem]"></div>
          <div className="flex justify-between items-start z-10">
            <h3 className="text-lg font-medium text-blue-200">Next Milestone</h3>
            <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center">
              <CodeBracketSquareIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="z-10">
            <h4 className="text-xl font-bold text-white mb-1">Project Demo Day</h4>
            <p className="text-sm text-slate-400 mb-4">Presenting to Chidi & Peers</p>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
              <ClockIcon className="w-4 h-4" />
              Fri, 5:00 PM
            </div>
          </div>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        
        {/* Left Column: Up Next & AI Summary */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="bg-white rounded-[1.5rem] p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">Up Next</span>
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <ClockIcon className="w-4 h-4" /> 45 mins
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">4.3 Building Custom React Hooks</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Learn how to extract state logic into reusable functions. We'll build a useFetch hook and a useLocalStorage hook to handle persistent data across our application.
            </p>
            
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 mb-8 relative">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shadow-sm">
                <SparklesIcon className="w-4 h-4 text-indigo-600" />
              </div>
              <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                AI Lesson Summary
              </h4>
              <ul className="space-y-2">
                <li className="text-sm text-indigo-800/80 flex gap-2">
                  <span className="text-indigo-400">•</span> Hooks must start with "use" to leverage React's linter.
                </li>
                <li className="text-sm text-indigo-800/80 flex gap-2">
                  <span className="text-indigo-400">•</span> They allow you to reuse stateful logic without changing your component hierarchy.
                </li>
              </ul>
            </div>
            
            <button className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              <PlayIcon className="w-5 h-5" />
              Start Lesson
            </button>
          </div>

          {/* Submission Feedback */}
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Feedback</h3>
            <div className="border border-green-100 bg-green-50/50 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src="/avatars/mentor.jpg" alt="Mentor" className="w-8 h-8 rounded-full object-cover" onError={(e) => e.currentTarget.src='https://ui-avatars.com/api/?name=Chidi&background=10B981&color=fff'} />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Approved by Mentor Chidi</h4>
                    <p className="text-xs text-gray-500">Project 3: E-commerce Cart</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Passed</span>
              </div>
              <p className="text-sm text-gray-700 italic border-l-2 border-green-300 pl-3 py-1">
                "Great separation of concerns here Ada. Your Redux slice is very clean. One small tip for next time: try using reselect for memoizing your cart total calculations. Otherwise, perfect. 🚀"
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Classroom & Cohort */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Live Classroom Status */}
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Classroom
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">8 Online</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src="/avatars/mentor.jpg" alt="Mentor" className="w-10 h-10 rounded-full border-2 border-blue-100" onError={(e) => e.currentTarget.src='/avatars/character10.jpg'} />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Mentor Chidi <span className="text-blue-500 text-xs">◆</span></h4>
                    <p className="text-xs text-gray-500">Reviewing Pull Requests</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src="/avatars/character1.jpg" alt="Sarah Jenkins" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Sarah Jenkins</h4>
                    <p className="text-xs text-blue-600 font-medium">In Coworking Room B</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors">Join</button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src="/avatars/character2.jpg" alt="David O." className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">David O.</h4>
                    <p className="text-xs text-gray-500">Watching Module 4.2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gamification / Leaderboard snippet */}
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
              Weekly Top Builders
              <UsersIcon className="w-5 h-5 text-gray-400" />
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-yellow-50/50 p-3 rounded-xl border border-yellow-100">
                <span className="text-lg font-bold text-yellow-600 w-4 text-center">1</span>
                <img src="/avatars/character3.jpg" alt="Michael Chen" className="w-8 h-8 rounded-full border border-yellow-200 object-cover" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900">Michael Chen</h4>
                </div>
                <span className="text-sm font-bold text-gray-700">850 XP</span>
              </div>
              
              <div className="flex items-center gap-4 p-3 rounded-xl">
                <span className="text-lg font-bold text-gray-400 w-4 text-center">2</span>
                <img src="/avatars/character4.jpg" alt="Ada Lovelace" className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900">Ada Lovelace (You)</h4>
                </div>
                <span className="text-sm font-bold text-gray-700">720 XP</span>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-xl">
                <span className="text-lg font-bold text-orange-400 w-4 text-center">3</span>
                <img src="/avatars/character1.jpg" alt="Sarah Jenkins" className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900">Sarah Jenkins</h4>
                </div>
                <span className="text-sm font-bold text-gray-700">690 XP</span>
              </div>
            </div>
            
            <button className="w-full mt-4 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors py-2 text-center">
              View Full Leaderboard
            </button>
          </div>

        </div>

      </div>
    </>
  );
}
