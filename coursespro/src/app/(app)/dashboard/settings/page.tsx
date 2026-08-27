"use client";
import React from 'react';

export default function SettingsPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account, billing, and platform preferences.</p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#146ef5]" defaultValue="David K." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#146ef5]" defaultValue="david@example.com" />
            </div>
            <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all mt-2">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}