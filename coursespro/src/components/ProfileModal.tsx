import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProfileModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-semibold text-slate-900">Manage Profile</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-500 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b border-gray-100 shrink-0 px-6 pt-4 gap-6">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'profile' ? 'border-[#146ef5] text-[#146ef5]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          >
            Profile Info
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'security' ? 'border-[#146ef5] text-[#146ef5]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          >
            Security & MFA
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#146ef5]" 
                  defaultValue={user?.name || "David K."} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#146ef5]" 
                  defaultValue={user?.email || "david@example.com"} 
                />
              </div>
              <button 
                onClick={() => alert("Profile updated!")}
                className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all mt-2"
              >
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900">Change Password</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#146ef5]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#146ef5]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#146ef5]" />
                </div>
                <button 
                  onClick={() => alert("Password changed!")}
                  className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  Update Password
                </button>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Two-Factor Authentication (MFA)</h4>
                <p className="text-xs text-gray-500 mb-4">Add an extra layer of security to your account by requiring a code from an authenticator app when you log in.</p>
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Authenticator App</p>
                    <p className="text-xs text-gray-500">Currently disabled</p>
                  </div>
                  <button 
                    onClick={() => alert("MFA setup initiated!")}
                    className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition-all"
                  >
                    Enable
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
