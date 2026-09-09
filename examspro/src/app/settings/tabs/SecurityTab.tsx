import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export default function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
        
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Current Password</Label>
            <div className="relative">
              <Input 
                type={showCurrent ? "text" : "password"}
                className="bg-slate-50 border-slate-200 h-12 rounded-xl text-gray-900 pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showCurrent ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">New Password</Label>
            <div className="relative">
              <Input 
                type={showNew ? "text" : "password"}
                className="bg-slate-50 border-slate-200 h-12 rounded-xl text-gray-900 pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showNew ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Confirm New Password</Label>
            <div className="relative">
              <Input 
                type={showConfirm ? "text" : "password"}
                className="bg-slate-50 border-slate-200 h-12 rounded-xl text-gray-900 pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirm ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button className="bg-[#146ef5] text-white hover:bg-blue-700 rounded-xl w-full h-12 font-bold mt-4">
            Update Password
          </Button>
        </div>
      </div>
    </div>
  );
}
