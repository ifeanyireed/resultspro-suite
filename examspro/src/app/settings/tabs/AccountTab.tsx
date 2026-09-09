import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { IconLoader2 } from '@tabler/icons-react';

export default function AccountTab() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { updateUser } = useAuthStore();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.put('/user/profile', { name, phone });
      updateUser({ name }); // Update global store so the top navbar updates instantly!
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

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
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#146ef5] text-white hover:bg-blue-700 rounded-xl px-8 h-12 font-bold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving && <IconLoader2 className="w-4 h-4 animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
