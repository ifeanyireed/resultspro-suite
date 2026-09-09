import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AccountTab() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</Label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-50 border-slate-200 h-12 rounded-xl text-gray-900"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</Label>
            <Input 
              value={email}
              disabled
              className="bg-slate-100 border-slate-200 h-12 rounded-xl text-gray-500 cursor-not-allowed"
            />
            <p className="text-[10px] text-gray-400">Email cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</Label>
            <Input 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234..."
              className="bg-slate-50 border-slate-200 h-12 rounded-xl text-gray-900"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button className="bg-[#146ef5] text-white hover:bg-blue-700 rounded-xl px-8 h-12 font-bold">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
