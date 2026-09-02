"use client";

import React from 'react';
import { 
  UserCircleIcon,
  CreditCardIcon,
  BellAlertIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your profile, payout details, and account preferences.</p>
        </div>
        <button className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-all flex items-center gap-2">
          <CheckCircleIcon className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Settings Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#eef5ff] text-[#146ef5] rounded-xl font-medium transition-colors border-l-4 border-[#146ef5] text-left">
            <UserCircleIcon className="w-5 h-5" />
            Profile Information
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition-colors border-l-4 border-transparent text-left">
            <CreditCardIcon className="w-5 h-5" />
            Payout Methods
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition-colors border-l-4 border-transparent text-left">
            <BellAlertIcon className="w-5 h-5" />
            Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition-colors border-l-4 border-transparent text-left">
            <ShieldCheckIcon className="w-5 h-5" />
            Security & Password
          </button>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Profile Information</h3>
              <p className="text-xs text-gray-500 mt-1">Update your personal details and public profile.</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-tr from-orange-200 to-orange-100 rounded-full overflow-hidden flex items-center justify-center border-4 border-white shadow-md shrink-0">
                  <img src="/avatars/character8.jpg" alt="Agent Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors mb-2">
                    Change Picture
                  </button>
                  <p className="text-[10px] text-gray-400">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">First Name</label>
                  <input type="text" defaultValue="Totok" className="w-full bg-gray-50 border border-gray-200 focus:border-[#146ef5] outline-none rounded-xl py-2.5 px-4 text-sm text-gray-900 shadow-sm transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Last Name</label>
                  <input type="text" defaultValue="Michael" className="w-full bg-gray-50 border border-gray-200 focus:border-[#146ef5] outline-none rounded-xl py-2.5 px-4 text-sm text-gray-900 shadow-sm transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input type="email" defaultValue="tmichael20@gmail.com" className="w-full bg-gray-50 border border-gray-200 focus:border-[#146ef5] outline-none rounded-xl py-2.5 px-4 text-sm text-gray-900 shadow-sm transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input type="tel" defaultValue="+234 800 123 4567" className="w-full bg-gray-50 border border-gray-200 focus:border-[#146ef5] outline-none rounded-xl py-2.5 px-4 text-sm text-gray-900 shadow-sm transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Payout Details Card */}
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900">Payout Details</h3>
                <p className="text-xs text-gray-500 mt-1">Where we should send your earned bounties.</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bank Name</label>
                  <select className="w-full bg-gray-50 border border-gray-200 focus:border-[#146ef5] outline-none rounded-xl py-2.5 px-4 text-sm text-gray-900 shadow-sm transition-colors appearance-none">
                    <option>Guaranty Trust Bank (GTB)</option>
                    <option>Zenith Bank</option>
                    <option>First Bank of Nigeria</option>
                    <option>Access Bank</option>
                    <option>United Bank for Africa (UBA)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Account Number</label>
                  <input type="text" defaultValue="0123456789" className="w-full bg-gray-50 border border-gray-200 focus:border-[#146ef5] outline-none rounded-xl py-2.5 px-4 text-sm text-gray-900 shadow-sm transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Account Name</label>
                  <input type="text" defaultValue="Totok Michael" className="w-full bg-gray-50 border border-gray-200 focus:border-[#146ef5] outline-none rounded-xl py-2.5 px-4 text-sm text-gray-900 shadow-sm transition-colors" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
