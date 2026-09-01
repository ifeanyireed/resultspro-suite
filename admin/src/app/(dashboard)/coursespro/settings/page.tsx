'use client';

import React from 'react';
import { 
  CheckCircleIcon,
  CogIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Platform & AI Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Super Admin configuration for BuilderOS.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Config */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#146ef5] flex items-center justify-center">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">AI Features</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Quiz & Assignment Generator</p>
                <p className="text-xs text-gray-500 mt-0.5">Enable AI to auto-generate quizzes for modules.</p>
              </div>
              <div className="w-12 h-6 bg-[#146ef5] rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Mentor AI Assistant</p>
                <p className="text-xs text-gray-500 mt-0.5">Surface risk alerts to mentors based on student activity.</p>
              </div>
              <div className="w-12 h-6 bg-[#146ef5] rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">AI Cost Monitoring limit</p>
                <p className="text-xs text-gray-500 mt-0.5">Pause generation when monthly token limit is reached.</p>
              </div>
              <input type="text" value="₦50,000 / mo" className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-32 text-center" readOnly />
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
              <CogIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Platform Permissions</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Allow Open Registration</p>
                <p className="text-xs text-gray-500 mt-0.5">Students can join waitlist without invitation.</p>
              </div>
              <div className="w-12 h-6 bg-[#146ef5] rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Enforce Hard Deadlines</p>
                <p className="text-xs text-gray-500 mt-0.5">Prevent project submission after due date.</p>
              </div>
              <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
