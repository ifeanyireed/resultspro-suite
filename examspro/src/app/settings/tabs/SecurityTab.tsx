import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SecurityTab() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
        
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Current Password</Label>
            <Input 
              type="password"
              className="bg-slate-50 border-slate-200 h-12 rounded-xl text-gray-900"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">New Password</Label>
            <Input 
              type="password"
              className="bg-slate-50 border-slate-200 h-12 rounded-xl text-gray-900"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Confirm New Password</Label>
            <Input 
              type="password"
              className="bg-slate-50 border-slate-200 h-12 rounded-xl text-gray-900"
            />
          </div>

          <Button className="bg-[#146ef5] text-white hover:bg-blue-700 rounded-xl w-full h-12 font-bold mt-4">
            Update Password
          </Button>
        </div>
      </div>
    </div>
  );
}
