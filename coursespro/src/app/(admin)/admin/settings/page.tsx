'use client';

import React, { useState } from 'react';
import { 
  CheckCircleIcon,
  CogIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: 'Skillup Academy',
    shortName: 'Skillup',
    slug: 'skillupacademy',
    adminEmail: 'platform@resultspro.ng',
    password: '',
    address: '123 Innovation Drive, Tech Hub, Lagos',
    contactPerson: 'Admin User',
    phone: '+234 800 000 0000',
    plan: 'Pro Tier - Active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Platform & AI Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Super Admin configuration for BuilderOS.</p>
        </div>
        <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-all">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Profile Settings (Spans full width on large screens) */}
        <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BuildingOfficeIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Platform Profile</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academy Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Name / Motto</label>
                <input type="text" name="shortName" value={formData.shortName} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Slug (URL)</label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#146ef5] transition-colors">
                  <span className="px-4 py-2.5 bg-gray-50 text-gray-500 text-sm border-r border-gray-200">https://</span>
                  <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-2.5 text-sm focus:outline-none" />
                  <span className="px-4 py-2.5 bg-gray-50 text-gray-500 text-sm border-l border-gray-200">.coursespro.co</span>
                </div>
              </div>
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                    <PhotoIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <button className="text-sm font-medium text-[#146ef5] hover:text-[#105bd1] transition-colors">
                    Upload new logo
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                <input type="email" name="adminEmail" value={formData.adminEmail} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Admin Password</label>
                <input type="password" name="password" placeholder="Enter new password to change..." value={formData.password} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person & Phone</label>
                <div className="flex gap-3">
                  <input type="text" name="contactPerson" placeholder="Name" value={formData.contactPerson} onChange={handleChange} className="w-1/2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] transition-colors" />
                  <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-1/2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#146ef5] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Details</label>
                <input type="text" name="plan" value={formData.plan} readOnly className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none cursor-not-allowed" />
              </div>
            </div>
          </div>
        </div>

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
